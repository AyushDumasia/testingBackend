import express from 'express'
import validateToken from './../middlewares/validateUser.js'
import validateAdmin from './../middlewares/auth.js'
import {
    changeStatus,
    // addOrder,
    createOrder,
    fetchOrder,
    fetchSpecificOrder,
} from '../controllers/order.controller.js'
const router = express.Router()

// * Create a new order
router.post('/createOrder', validateToken, createOrder)

// ! Add a  order
// router.get('/addOrder/:id', validateToken, addOrder)

// * Fetch Order Details for a specific User
router.get('/fetchOrder', validateToken, fetchSpecificOrder)

// * Fetch Order Details for an Admin
router.get('/getOrder', fetchOrder)

router.put('/changeStatus/:id', validateAdmin, changeStatus)
export default router
