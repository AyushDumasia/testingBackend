import Merchant from '../models/merchant.schema.js'

export const validateMerchant = async (req, res, next) => {
    try {
        const merchant = req.user
        const validateUser = await Merchant.find({merchant: merchant.id})
        console.log('validate User  : ', validateUser)
        if (!validateUser) {
            return res.status(404).json({message: 'Merchant not found'})
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}
