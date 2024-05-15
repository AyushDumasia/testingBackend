import express from 'express'
import validateToken from './../middlewares/validateUser.js'
import {fetchAddress, mergeAddress} from '../controllers/address.controller.js'
const router = express.Router()

// * Create Address
router.post('/createAddress', validateToken, mergeAddress)

// * Fetch Address for specific User
router.get('/fetchAddress', validateToken, fetchAddress)

export default router
