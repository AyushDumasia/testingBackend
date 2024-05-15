const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = schema(
    {
        username: {
            type: String,
            required: [true, 'Please add the  Username'],
        },
        email: {
            type: String,
            required: [true, 'Please add the contact email'],
            unique: [true, 'Email already Register'],
        },
        password: {
            type: String,
            required: [true, 'Password'],
        },
    },
    {
        timestamps: true,
    },
)

const User = mongoose.model('User', userSchema)

module.exports = User
