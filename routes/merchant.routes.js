import express from 'express'
const router = express.Router()
import {
    becomeMerchant,
    currentMerchant,
} from '../controllers/merchant.controller.js'

import validateToken from './../middlewares/validateUser.js'
import {upload} from '../middlewares/multer.js'

// *  Become  a merchant
router.post(
    '/becomeMerchant',
    validateToken,
    upload.single('document'),
    becomeMerchant,
)

// * Fetch a data for a merchant
router.get('/currentMerchant', validateToken, currentMerchant)

export default router
