import express from 'express'
import validateToken from './../middlewares/validateUser.js'
import {
    createFeedback,
    fetchFeedback,
} from '../controllers/feedback.controller.js'
const router = express.Router()

// * Create a new feedback
router.post('/createFeedback', validateToken, createFeedback)

// *  Fetch the feedback
router.get('/fetchFeedback/:id', fetchFeedback)

export default router
