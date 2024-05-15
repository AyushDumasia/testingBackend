import {z} from 'zod'

const validUser = z.object({
    username: z
        .string()
        .trim()
        .min(5, 'Username must be at least 5 characters long')
        .max(200, 'Username must be at most 200 characters long'),
    email: z
        .string()
        .email('Invalid email address')
        .min(3, 'Email must be at least 3 characters long')
        .max(200, 'Email must be at most 200 characters long'),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 characters long'),
    sex: z.string().min(4, 'Gender must be specified'),
    password: z.string().min(5, 'Password must be at least 5 characters long'),
})

export default validUser
