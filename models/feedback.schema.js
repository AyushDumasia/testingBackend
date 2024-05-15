import mongoose from 'mongoose'
const Schema = mongoose.Schema

const feedbackSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

const Feedback = mongoose.model('Feedback', feedbackSchema)

export default Feedback
