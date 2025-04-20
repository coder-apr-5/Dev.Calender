import {z} from 'zod'
import { ObjectId } from 'mongodb'

export const User = z.object({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId).optional(),
    email: z.string().email(),
    username: z.string().max(100).min(3),
    password: z.string().min(6).optional()
})

export type User = z.infer<typeof User>

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

export const Tokens = z.object({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId).optional(),
    tokenId: z.string().uuid(),
    expiresAt: z.date()
})

export type Tokens = z.infer<typeof Tokens>

export const Events = z.object({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId).optional(),
    timeStart: z.string().refine(v => new Date(v)),
    name: z.string().min(5).max(256),
    description: z.string().optional(),
    userId: z.custom<ObjectId>((val) => val instanceof ObjectId).optional()
})

export type Events = z.infer<typeof Events>