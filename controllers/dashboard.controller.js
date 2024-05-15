import DailyUser from '../models/dailyActive.schema.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import moment from 'moment'

export const fetchDailyUser = asyncHandler(async (req, res) => {
    const todayDate = moment().startOf('day')

    try {
        const userCount = await DailyUser.countDocuments({date: todayDate})

        res.status(200).json({
            count: userCount,
            message: 'Daily user count for today',
        })
    } catch (err) {
        res.status(500).json({message: 'Error fetching daily user count'})
    }
})
