import {z} from 'zod'

export const UserRegister = z.object({
    email: z.string().email(),
    username: z.string().max(100).min(3),
    password: z.string().min(6)
})

export type UserRegister = z.infer<typeof UserRegister>

export const UserLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type UserLogin = z.infer<typeof UserLogin>