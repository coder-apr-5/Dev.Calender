import {sign} from 'jsonwebtoken'
const jwt_secret = process.env['JWT_SECRET'] as string

export const generateAccessToken = (email: string, username: string) => {
    return sign({username, email}, jwt_secret, {expiresIn: 15*60})
}