import TempProduct from '../models/pendingProduct.schema.js'
import Product from './../models/product.schema.js'
import {asyncHandler} from './../utils/asyncHandler.js'
import User from './../models/user.schema.js'
import {getMail} from '../utils/nodemailer.js'
import DailyUser from '../models/dailyActive.schema.js'
import Order from './../models/order.schema.js'
import {nodeCache} from './product.controller.js'

// * Show a pending products for a Approval
export const showPendingProduct = asyncHandler(async (req, res) => {
    const product = await TempProduct.findOne()
    res.status(200).json(product)
})

// * Approve a pending product
export const validProduct = asyncHandler(async (req, res) => {
    const userId = req.user?.id
    const productId = req.params.id

    if (nodeCache.has('products')) {
        nodeCache.del('products')
    }

    const tempProduct = await TempProduct.findById(productId)
    if (!tempProduct) {
        throw new ApiError(404, 'Temporary product not found')
    }

    const approvedProduct = new Product({
        productName: tempProduct.productName,
        category: tempProduct.category,
        description: tempProduct.description,
        images: tempProduct.images,
        stock: tempProduct.stock || 10,
        price: tempProduct.price,
        userId: tempProduct.userId,
    })

    const user = await User.findById(tempProduct.userId)
    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    await approvedProduct.save()
    await tempProduct.deleteOne()

    await getMail(
        user.email,
        `Confirmation about product ${approvedProduct.productName}`,
        `We approved your product ${approvedProduct.productName}`,
    )

    res.status(200).json(approvedProduct)
})

// * Not Approve a pending product
export const notApprovedProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id
    const tempProduct = await TempProduct.findByIdAndDelete(productId)
    res.status(200).json(tempProduct)
})

// * Fetch a Daily Active User
export const dailyUser = asyncHandler(async (req, res) => {
    const counts = await DailyUser.find()

    let countArr = {
        countVal: [],
        label: [],
    }

    for (const count of counts) {
        countArr.countVal.push(count.count)
        countArr.label.push(count.date)
    }

    res.status(200).json(countArr)
})

// * Fetch a category for a Chart
export const totalCategory = asyncHandler(async (req, res) => {
    const categoryCounts = await Product.aggregate([
        {$group: {_id: '$category', count: {$sum: 1}}},
    ])

    res.json(categoryCounts)
})

// * Fetch a Order for a chart
export const chartOrder = asyncHandler(async (req, res) => {
    const order = await Order.aggregate([
        {
            $group: {
                _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
                count: {$sum: 1},
            },
        },
    ])
    res.json(order)
})
