import mongoose from 'mongoose'
const Schema = mongoose.Schema

const addressSchema = new Schema(
    {
        address1: {
            type: String,
            required: true,
        },
        address2: {
            type: String,
            // required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

const Address = mongoose.model('Address', addressSchema)

export default Address
