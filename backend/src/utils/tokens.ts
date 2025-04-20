import {sign, verify, type JwtPayload} from 'jsonwebtoken'
import { tokens } from '../services/db'
const jwt_secret = process.env['JWT_SECRET'] as string
export const generateAccessToken = (email: string, username: string) => {
    return sign({username, email}, jwt_secret, {expiresIn: 15*60})
}

export const generateRefreshToken = async (email: string, username: string) => {
    const tokenId = crypto.randomUUID()
    await tokens.insertOne({tokenId, expiresAt: new Date(Date.now()+(5*24*60*60*1000))})
    return {token: sign({email, tokenId, username}, jwt_secret, {expiresIn: 5*24*60*60}), id: tokenId}
}

export const refreshAccessToken = async (refreshToken: string) => {
    const {email, username, tokenId} = verify(refreshToken, jwt_secret) as JwtPayload
    const t = await tokens.findOne({tokenId})
    if(!t) throw Error("Invalid refresh token");
    if(t.expiresAt < new Date()) throw Error("Refresh token expired");
    return sign({username, email}, jwt_secret, {expiresIn: 15*60})
}

export const verifyAccessToken = (accessToken: string) => {
    return verify(accessToken, jwt_secret)
}