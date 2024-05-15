import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            // required: true,
            // length: 10,
        },
        sex: {
            type: String,
            // required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
        },
        cart: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        address: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Address',
            },
        ],
    },
    {
        timestamps: true,
    },
)

const User = mongoose.model('User', userSchema)

export default User
