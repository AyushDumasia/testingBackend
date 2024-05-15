import jwt from 'jsonwebtoken'
import User from '../models/user.schema.js'
import {ApiError} from '../utils/ApiError.js'

const validateToken = async (req, res, next) => {
    const cookie = req.cookies?.userCookie
    if (cookie) {
        jwt.verify(cookie, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = decoded.user
            next()
        })
    } else {
        res.status(401).json('User not authenticated')
    }
}

export default validateToken
