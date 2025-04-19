import type { RequestHandler } from "express";
import { users } from "../services/db";
import { verify, type JwtPayload } from 'jsonwebtoken'

const authMiddleware: RequestHandler = async (req, res, next) => {
    req.headers.authorization = req.headers.authorization?.split(" ")[1]
    let authed = {email:""}
    try {
        authed.email = (verify(req.headers.authorization!, process.env['JWT_SECRET']!!) as JwtPayload).email ?? ""
    } catch(_) {
        res.status(400).send({status: 400, message: "Invalid token"})
        return
    }
    try {
        const user = await users.findOne({email: authed.email})
        if(!user) {
            res.status(404).send({status: 404, message: "User not found"})
            return
        }
        req.user = user
    } catch(_) {
        res.status(500).send({status: 500, message: "Unknown Error"})
        return
    }
    next();
}

export default authMiddleware;