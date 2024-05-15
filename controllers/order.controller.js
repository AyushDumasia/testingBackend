import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import User from '../models/user.schema.js'
import {ApiError} from '../utils/ApiError.js'
import Cart from '../models/cart.schema.js'
import Order from '../models/order.schema.js'
import Product from './../models/product.schema.js'
import {v4 as uuidv4} from 'uuid'

// * Create a new Product
export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const user = await User.findOne({_id: userId})

    const cartItems = await Cart.find({userId: userId})

    const orderId = uuidv4().substring(0, 6)

    const orders = []

    for (const cartItem of cartItems) {
        const product = await Cart.findOne({
            productId: cartItem.productId,
        }).populate('productId')
        let price = parseInt(product.productId.price) * cartItem.quantity
        const newOrder = new Order({
            orderId: orderId,
            productId: cartItem.productId._id,
            userId: userId,
            price: price,
            address: user.address[0] || null,
            status: 'Order Confirmed',
        })
        const validOrder = await Order.find({cartId: cartItem._id})

        await newOrder.save()
        orders.push(newOrder)
    }

    res.status(200).json(orders)
})

// * Fetch an Order for a specific User
export const fetchSpecificOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const order = await Order.find({userId: userId})
        .populate('productId')
        .populate('address')
    res.status(200).json({
        order: order,
        address: order?.address,
    })
})

// * Fetch an Order for an Admin
export const fetchOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .sort({createdAt: -1})
        .populate('productId')
        .populate('userId')

    if (!orders || orders.length === 0) {
        return res
            .status(201)
            .json(new ApiResponse(201, null, 'No order found'))
    }

    // ! const product = orders.map((order) => order.productId)
    // ! const user = orders.map((order) => order.userId)
    return res.status(200).json(orders)
})

// * Change Status for an Admin
export const changeStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id
    const newStatus = req.body.status

    const order = await Order.findById(orderId)

    if (!order) {
        return res
            .status(404)
            .json({success: false, message: 'Order not found'})
    }

    order.status = newStatus

    await order.save()

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
    })
})
