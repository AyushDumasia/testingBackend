import {ApiResponse} from './../utils/ApiResponse.js'
export const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body)
        req.body = parseBody
        next()
    } catch (err) {
        console.error(err)
        return res.status(400).json(err)
    }
}
