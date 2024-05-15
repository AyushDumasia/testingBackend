import mongoose from 'mongoose'

const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connect with Databases')
        })
        .catch((err) => {
            console.log('Error connecting with Database')
        })
}

export default connectDB
