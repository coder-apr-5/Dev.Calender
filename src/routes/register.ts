import { RequestHandler, Router } from "express";
import { UserRegister } from "../validations/schemas";
import { users } from "../services/db";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

const app = Router()

const RegisterValidate: RequestHandler = (req, res, next) => {
    const result = UserRegister.safeParse(req.body)
    if(!result.success) {
        res.status(400).send(result.error.issues)
        return
    }
    req.body = result.data
    next()
}

app.post('/register', RegisterValidate, async (req, res) => {
    try {
        const {email, password, username} = req.body
        const user = await users.findOne({email})
        if(user) {
            res.status(400).send({status: 400, message: "User with same email already exists."});
            return
        }
        const token = generateAccessToken(email, username)
        const rt = await generateRefreshToken(email, username)
        const pwd = await Bun.password.hash(password)
        await users.insertOne({email, username, password:pwd})
        res.status(201).send({status:201, message: "User Created", access_token: token, refresh_token: rt.token})
    } catch(_) {
        res.status(500).send({status:500, message: "Unknown Error"})
    }
})

export default app