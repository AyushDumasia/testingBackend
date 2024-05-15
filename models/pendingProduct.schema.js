import mongoose from 'mongoose'
const Schema = mongoose.Schema

const pendingProduct = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        stock: {
            type: Number,
            required: true,
        },
        price: {
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

const TempProduct = mongoose.model('TempProduct', pendingProduct)

export default TempProduct
