import express from 'express'
const router = express.Router()
import moment from 'moment'

import validateToken from './../middlewares/validateUser.js'
import validateAdmin from './../middlewares/auth.js'
import {
    chartOrder,
    dailyUser,
    notApprovedProduct,
    showPendingProduct,
    totalCategory,
    validProduct,
} from '../controllers/admin.controller.js'

router.use(validateAdmin)

// * Show a pending product for an approval
router.get('/showPendingProducts', showPendingProduct)

// * Approve a product
router.post('/validProduct/:id', validProduct)

// * Not approve a product
router.post('/notApproved/:id', notApprovedProduct)

// * Daily User chart
router.get('/dailyUser', dailyUser)

// * Category Chart
router.get('/countCategory', totalCategory)

// * Order Chart
router.get('/countOrder', chartOrder)

export default router
