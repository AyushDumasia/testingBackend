const User = require('../models/userModel.js')
const asyncHandler = require('express-async-handler')
const passport = require('passport')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

const register = async (req, res) => {
    let { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(404)
        throw new Error('Not found')
    }
    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.json({
            message: 'Email Already Register',
        })
    }
    let hashedPassword = await bcrypt.hash(password, saltRounds)
    const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
    })
    console.log('User registration Successfully')
    await newUser.save()
    res.json({
        Name: newUser.username,
        Password: password,
    })
}

const current = async (req, res) => {
    res.json(req.user)
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            message: 'User not found',
        })
    }
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            '123',
            { expiresIn: '15m' },
        )
        res.status(200).json({ accessToken })
    } else {
        res.status(404)
        return
    }
}

// let register = async (req, res) => {
//     let { username, email, password } = req.body
//     let oldNumber = await User.findOne({ phone })
//     let oldEmail = await User.findOne({ email })
//     if (oldNumber) {
//         req.flash('failure', 'Number already in use')
//         return res.redirect('/sign-up')
//     }
//     if (oldEmail) {
//         req.flash('failure', 'Email already in use')
//         return res.redirect('/sign-up')
//     }
//     try {
//         const newUser = new User({ username, email, phone })
//         let registerUser = await User.register(newUser, password)
//         req.login(registerUser, (err) => {
//             if (err) {
//                 return next(err)
//             }
//             req.flash('success', 'User was logged in successfully')
//             res.redirect('/home')
//         })
//     } catch (e) {
//         req.flash('failure', e.message)
//         // res.redirect('/sign-up')
//     }
// }

let logOut = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
    })
    //   req.flash("failure", "Logged out successfully");
}

module.exports = { register, logOut, login }
