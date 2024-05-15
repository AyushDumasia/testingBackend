import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.schema.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from './../utils/apiError.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import Address from './../models/address.schema.js'
import Order from './../models/order.schema.js'
const saltRounds = 10
import {getMail} from '../utils/nodemailer.js'
import DailyUser from '../models/dailyActive.schema.js'
import Merchant from './../models/merchant.schema.js'

const countUser = async () => {
    const date = new Date().toISOString().split('T')[0]

    let dailyUser = await DailyUser.findOne({date: date})
    if (!dailyUser) {
        const newDailyUser = new DailyUser({
            count: 1,
            date: date,
        })
        await newDailyUser.save()
    } else {
        dailyUser.count++
        await dailyUser.save()
    }
}

// * Sign Up
export const signUp = asyncHandler(async (req, res) => {
    const {username, email, phone, sex, password} = req?.body
    const validEmail = await User.findOne({email: email})
    if (validEmail) throw new ApiError(409, 'Email already in use')

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        email,
        phone,
        sex,
        password: hashedPassword,
    })
    await newUser.save()
    const accessToken = jwt.sign(
        {
            user: {
                username: newUser.username,
                email: newUser.email,
                id: newUser.id,
            },
        },
        process.env.ACCESS_TOKEN,
        {expiresIn: process.env.EXPIRE_IN},
    )

    req.user = {
        username: newUser.username,
        email: newUser.email,
        id: newUser.id,
    }

    res.cookie('userCookie', accessToken, {
        httpOnly: true,
    })
    const newDailyUser = new DailyUser({
        userId: req.user.id || 1,
    })
    await newDailyUser.save()
    const info = getMail(
        newUser.email,
        'Welcome to Our Platform!',
        `Dear ${newUser.username},

    Welcome to e-Commerce! We're thrilled to have you join our community.`,
    )

    countUser()

    res.status(201).json(
        new ApiResponse(201, newUser, 'User logged in successfully'),
    )
})

// * Log in
export const logIn = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email: email})

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, 'Invalid Details')
    }

    const accessToken = jwt.sign(
        {
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN,
        {expiresIn: process.env.EXPIRE_IN},
    )

    req.user = {
        username: user.username,
        email: user.email,
        id: user.id,
    }
    countUser()

    res.cookie('userCookie', accessToken, {
        httpOnly: true,
    })
        .status(200)
        .json({user, accessToken})
})

// * LogOut
export const logOut = asyncHandler(async (req, res) => {
    res.clearCookie('userCookie').send('Cookie deleted')
})

// * Fetch User profile
export const getUserInfo = asyncHandler(async (req, res) => {
    const user = req?.user
    if (!user) {
        return res.status(404).json({message: 'User not found in request'})
    }
    const isMerchant = await Merchant.findOne({merchant: user.id})
    if (!isMerchant) {
        console.log('User is not merchant')
    }
    const findUser = await User.findById(user.id)
    const order = await Order.find({userId: user.id}).populate('productId')
    const address = await Address.find({userId: user.id})
    if (!findUser) {
        return res.status(404).json({message: 'User not found'})
    }
    res.status(200).json({
        user: findUser,
        merchant: isMerchant,
        order: order,
        address: address,
    })
})

// ! Update Profile
export const updateUser = asyncHandler(async (req, res) => {
    const user = req.user
    const email = req.body.email
    const password = req.body.password
    const updateUser = await User.findByIdAndUpdate(
        {_id: user.id},
        {password: password, email: email},
        {new: true},
    )
    if (!updateUser) {
        return res.status(404).json({message: 'User not found'})
    }

    res.status(200).json({
        message: 'User updated successfully',
        user: updateUser,
    })
})

// * Fetch a logged in user data
export const currentUser = asyncHandler(async (req, res) => {
    const user = req?.user
    if (!user) {
        return res.status(404).json('User not logged in')
    }
    res.status(200).json(user)
})
