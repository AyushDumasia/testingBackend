import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './db/connectDB.js' //Database connection
import Razorpay from 'razorpay'
//Routes
import userAuthRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import merchantRoutes from './routes/merchant.routes.js'
import adminRoutes from './routes/admin.routes.js'
import feedbackRoutes from './routes/feedback.routes.js'
import addressRoutes from './routes/address.routes.js'
import orderRoutes from './routes/order.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
const PORT = process.env.PORT || 3000
const app = express()

//Middlewares
dotenv.config({
    path: './.env',
})

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

//Cors Configuration
const corsOptions = {
    origin: function (origin, callback) {
        callback(
            null,
            (origin && origin.startsWith(process.env.CORS_ORIGIN)) || '*',
        )
    },
    credentials: true,
}
app.use(cors(corsOptions))
app.use(morgan('dev'))

// !
// app.use((req, res, next) => {
//     if (req.path !== '/favicon.ico') {
//         console.log(req.method, req.path)
//     }
//     next()
// })

// export const instance = new Razorpay({
//     key_id: process.env.RAZOR_PAY_API,
//     key_secret: process.env.RAZOR_PAY_KEY,
// })

app.use('/api/auth', userAuthRoutes)
app.use('/api/merchant', merchantRoutes)
app.use('/api/product', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/address', addressRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
    connectDB()
})
