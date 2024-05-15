import express from 'express'
import validateToken from './../middlewares/validateUser.js'
import {validate} from './../middlewares/zodValidator.js'
import validUser from './../validators/authValidators.js'
import {
    currentUser,
    getUserInfo,
    logIn,
    logOut,
    signUp,
    updateUser,
} from '../controllers/user.controller.js'

const router = express.Router()

// * Sign Up
// router.post('/signup', validate(validUser), signUp)
router.post('/signup', signUp)

// * Log in
router.post('/login', logIn)

// * LogOut
router.get('/logout', logOut)

// ! Fetch a logged in user data
router.get('/currentUser', validateToken, currentUser)

// * Fetch a logged in user data
router.get('/passInfo', validateToken, getUserInfo)

// ! Update Profile
router.post('/updatePass', updateUser)

export default router
