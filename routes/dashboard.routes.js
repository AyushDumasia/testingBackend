import express from 'express'
import {fetchDailyUser} from '../controllers/dashboard.controller.js'
const router = express.Router()

router.get('/dailyUser', fetchDailyUser)

export default router
