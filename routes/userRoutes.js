const express = require('express')
const router = express.Router()
const { register, logOut, login } = require('../controllers/userController.js')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
const validateToken = require('../middlewares/validateToken.js')
const { route } = require('./contactRoutes.js')

router.post('/register', asyncHandler(register))

router.post('/login', login)

router.post('/logOut', asyncHandler(logOut))

module.exports = router
