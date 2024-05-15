import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            // required: true,
        },
        status: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
)

const Order = mongoose.model('Order', orderSchema)

export default Order
