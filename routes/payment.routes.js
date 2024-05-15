import express from 'express'
import {checkOut} from '../controllers/payment.controller'
const router = express.Router()

router.route('/checkOut', checkOut)

export default router
