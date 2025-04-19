import { Router } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { tokens } from "../services/db";

const app = Router()
const jwt_secret = process.env['JWT_SECRET']!
app.post('/api/logout', async (req, res) => {
    try {
        if(!req.headers.refreshtoken) {
            res.status(401).send({status: 401, message: "Refresh token not found."})
            return
        }
        const {tokenId} = verify(req.headers.refreshtoken as string, jwt_secret) as JwtPayload
        await tokens.deleteOne({tokenId})
        res.send({status: 200, message: "User logged out"})
    } catch(_) {
        res.status(501).send({status: 501, message: "Unknown Error"})
    }
})