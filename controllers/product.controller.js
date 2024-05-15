import Product from '../models/product.schema.js'
import User from '../models/user.schema.js'
import Cart from '../models/cart.schema.js'
import TempProduct from '../models/pendingProduct.schema.js'
import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiError} from './../utils/ApiError.js'
import {uploadOnCloudinary} from './../utils/cloudinary.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import {getMail} from '../utils/nodemailer.js'
import NodeCache from 'node-cache'
import Order from '../models/order.schema.js'

export const nodeCache = new NodeCache()

// * Fetch Products for Explore page
export const fetchProduct = asyncHandler(async (req, res) => {
    let cacheData
    if (nodeCache.has('products')) {
        cacheData = JSON.parse(nodeCache.get('products'))
        return res.status(200).json({
            pagination: {
                count: cacheData.length,
                pageCount: 1,
                currentPage: 1,
            },
            products: cacheData,
        })
    } else {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const skip = (page - 1) * limit

        const query = {}
        const count = await Product.countDocuments(query)
        const pageCount = Math.ceil(count / limit)

        const products = await Product.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)

        // nodeCache.set('products', JSON.stringify(products))
        res.status(200).json({
            pagination: {
                count,
                pageCount,
                currentPage: page,
            },
            products,
        })
    }
})

// * Show Latest Products
export const showLatestProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({createdAt: -1})

    res.status(200).json(
        new ApiResponse(200, products, 'Latest Products fetched successfully'),
    )
})

// * Show a specific Product
export const showProduct = asyncHandler(async (req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('userId')
    res.status(200).json({
        product: product,
        userId: product.userId?.username,
    })
})

// * Create product
export const createProduct = asyncHandler(async (req, res) => {
    const {productName, category, description, price, stock} = req.body
    const userId = req.user.id
    const user = await User.findOne({_id: userId})

    const imagePaths = req.files.map((file) => file.path)

    const uploadedImages = await Promise.all(imagePaths.map(uploadOnCloudinary))

    if (uploadedImages.some((image) => !image)) {
        throw new ApiError(406, 'Images required')
    }

    const imageUrls = uploadedImages.map((image) => image.url)

    const newProduct = new TempProduct({
        productName,
        category,
        description,
        price,
        images: imageUrls,
        stock,
        userId,
    })

    await newProduct.save()

    await getMail(
        user.email,
        `Confirmation about product ${productName}`,
        `We will verify your product and it will display on the website.`,
    )

    res.status(200).json(new ApiResponse(200, newProduct))
})

// * Add to cart
export const addCart = asyncHandler(async (req, res) => {
    const user = req.user
    const productId = req.params.id
    const quantity = req.body.quantity || 1

    const currUser = await User.findOne({email: user.email})
    if (!currUser) {
        return res.status(404).json({message: 'User not found'})
    }

    const product = await Product.findOne({_id: productId})
    if (!product) {
        return res.status(404).json({message: 'Product not found'})
    }

    let cartItem = await Cart.findOne({productId, userId: user.id})

    if (cartItem) {
        // const availableQuantity = -cartItem.quantity
        if (quantity <= product.stock) {
            cartItem.quantity += quantity
        } else {
            return res
                .status(400)
                .json({message: 'Requested quantity exceeds available stock'})
        }
    } else {
        if (quantity <= product.stock) {
            cartItem = await Cart.create({
                productId,
                userId: user.id,
                quantity,
            })
            currUser.cart.push(cartItem)
            await currUser.save()
        } else {
            return res
                .status(400)
                .json({message: 'Requested quantity exceeds available stock'})
        }
    }

    product.stock -= quantity
    await product.save()
    await cartItem.save()

    res.status(200).json(
        new ApiResponse(200, cartItem, 'Cart updated successfully'),
    )
})

// * Remove from Cart
export const RemoveCart = asyncHandler(async (req, res) => {
    const user = req?.user
    const productId = req.params.id

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    if (!productId) {
        throw new ApiError(404, 'Product not found')
    }

    const originalProduct = await Product.findOne({_id: productId})

    const product = await Cart.findOne({productId: productId})

    product.quantity--
    originalProduct.stock++
    await originalProduct.save()
    if (product.quantity === 0) {
        await product.deleteOne()
        return res
            .status(200)
            .json(
                new ApiResponse(200, 'Product removed successfully from Cart'),
            )
    }
    if (product.quantity <= 0) {
        throw new ApiError(400, 'Quantity must be greater than zero')
    }
    await product.save()
    return res
        .status(200)
        .json(new ApiResponse(200, 'Product removed successfully'))
})

// * Fetch the data of cart for a specific User
export const getCart = asyncHandler(async (req, res) => {
    const user = req.user
    const findUser = await User.findOne({_id: user.id})
    if (!findUser) {
        return res.status(404).json({message: 'User not found'})
    }

    const cartItems = await Cart.find({userId: findUser._id}).populate(
        'productId',
    )
    if (!cartItems) {
        return res.status(404).json({message: 'Cart items not found'})
    }

    let totalPrice = 0
    for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem.productId)
        if (product) {
            totalPrice += parseFloat(product.price) * cartItem.quantity
        }
    }
    res.status(200).json({
        count: cartItems.length,
        cartItems: cartItems,
        totalPrice: totalPrice.toFixed(2),
    })
})

// * For Temp products
export const fetchTempProducts = asyncHandler(async (req, res) => {
    const products = await TempProduct.find()
    res.status(200).json(
        new ApiResponse(200, products, 'Product fetched successfully'),
    )
})

// * Sort category for suggestions
export const suggestions = asyncHandler(async (req, res) => {
    const id = req.params.id

    const product = await Product.findOne({_id: id})

    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse(404, [], 'Product not found'))
    }

    const suggestedProducts = await Product.find({
        category: product.category,
    })
    const filteredProducts = suggestedProducts.filter(
        (p) => p._id.toString() !== product._id.toString(),
    )

    if (!filteredProducts || filteredProducts.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], 'Products not found'))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                filteredProducts,
                'Products available for this category',
            ),
        )
})

// * Sort by category
export const sortByCategory = asyncHandler(async (req, res) => {
    const category = req.body.category
    const products = await Product.find({
        category: {$regex: category, $options: 'i'},
    })
    if (!products || products.length === 0) {
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    filteredProducts,
                    'No product available for this category',
                ),
            )
    }
    res.status(200).json(new ApiResponse(200, filteredProducts))
})

// * Search
export const search = asyncHandler(async (req, res) => {
    const {searchTerm} = req.params
    const results = await Product.find({
        $or: [
            {productName: {$regex: searchTerm, $options: 'i'}},
            {description: {$regex: searchTerm, $options: 'i'}},
            {category: {$regex: searchTerm, $options: 'i'}},
        ],
    })
    if (!results || results.length === 0) {
        return res
            .status(201)
            .json(new ApiResponse(201, results, 'There are no products'))
    }
    return res.status(201).json(new ApiResponse(201, results, 'Products find'))
})

// * Filter products by Price
export const sortProducts = asyncHandler(async (req, res) => {
    const option = req.params.option
    const productId = req.params.searchTerm
    const product = await Product.find({productName: productId})
    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse(404, [], 'Product not found'))
    }
    if (option === 'asc') {
        const results = await Product.find({
            $or: [
                {productName: {$regex: productId, $options: 'i'}},
                {description: {$regex: productId, $options: 'i'}},
                {category: {$regex: productId, $options: 'i'}},
            ],
        }).sort({price: -1})
        return res.status(200).json(new ApiResponse(200, results, 'OK'))
    } else if (option === 'dsc') {
        const results = await Product.find({
            $or: [
                {productName: {$regex: productId, $options: 'i'}},
                {description: {$regex: productId, $options: 'i'}},
                {category: {$regex: productId, $options: 'i'}},
            ],
        }).sort({price: 1})
        return res.status(200).json(new ApiResponse(200, results, 'OK'))
    }
})

// ! Bug in a nodeCache while changing in a Pagination
