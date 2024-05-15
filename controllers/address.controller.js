import Address from '../models/address.schema.js'
import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import User from '../models/user.schema.js'
import {ApiError} from '../utils/ApiError.js'

// * Create a new Address
export const mergeAddress = asyncHandler(async (req, res) => {
    const userId = req?.user.id
    const user = await User.findById(userId)
    const newAddress = new Address({
        address1: req?.body.address1,
        address2: req?.body.address2 || null,
        pinCode: req?.body.pinCode,
        city: req?.body.city,
        state: req?.body.state,
        country: req?.body.country,
        userId: req?.user.id,
    })

    const validAddress = await Address.find({address1: newAddress.address1})
    if (validAddress.length > 0) {
        throw new ApiError(401, 'You already added  this address')
    }

    await newAddress.save()

    user.address.push(newAddress)
    await user.save()
    return res
        .status(200)
        .json(new ApiResponse(200, newAddress, 'Address updated successfully'))
})

// * Fetch an Address for a specific User
export const fetchAddress = asyncHandler(async (req, res) => {
    const userId = req?.user.id
    const address = await User.findById(userId).populate('address')
    res.status(200).json(
        new ApiResponse(200, address.address, 'Address fetched successfully'),
    )
})
