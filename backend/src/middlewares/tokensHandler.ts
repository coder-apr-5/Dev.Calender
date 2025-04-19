import type { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

const tokensHandlerMiddleware: RequestHandler = (req, res, next) => {
    const at = req.headers.authorization?.split(" ")[1]
    try {
        verify(at!, process.env['JWT_SECRET']!)
    } catch(_) {
        res.status(401).send({status:401, message: "Token expired or invalid"})
        return
    }
    next()
}

export default tokensHandlerMiddleware