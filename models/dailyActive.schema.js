import mongoose from 'mongoose'
const Schema = mongoose.Schema

const dailyUserSchema = new mongoose.Schema(
    {
        count: {
            type: Number,
        },
        date: {
            type: Date,
            default: new Date().toISOString().split('T')[0],
        },
    },
    {
        timestamps: true,
    },
)

const DailyUser = mongoose.model('DailyUser', dailyUserSchema)

export default DailyUser
