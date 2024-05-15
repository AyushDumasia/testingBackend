import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import sharp from 'sharp'
import {asyncHandler} from './asyncHandler.js'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const transformation = {
            quality: 'auto:low',
        }

        let res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image',
            transformation: transformation,
        })

        return res
    } catch (err) {
        return null
    } finally {
        fs.unlinkSync(localFilePath)
    }
}

// export const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         let res = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'image',
//         })
//         console.log('Upload Successfully : ', res)
//         return res
//     } catch (err) {
//         return null
//     } finally {
//         fs.unlinkSync(localFilePath)
//     }
// }
