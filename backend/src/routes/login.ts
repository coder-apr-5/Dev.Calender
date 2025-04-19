import { Router, type RequestHandler } from "express";
import { UserLogin } from "../validations/schemas";
import { users } from "../services/db";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { sendLoginMail } from "../services/mail";

const app = Router()

const LoginValidate: RequestHandler = async (req, res, next) => {
    const result = UserLogin.safeParse(req.body)
    if(!result.success) {
        res.status(400).send(result.error.issues)
        return;
    }
    req.body = result.data
    next()
}

app.post('/login', LoginValidate, async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await users.findOne({email})
        const isMatch = await Bun.password.verify(password, user?.password!)
        
        if(!user || !isMatch) {
            res.status(404).send({status: 404, message: "User not found"})
            return
        }
        const token = generateAccessToken(email, user.username)
        const rt = await generateRefreshToken(email, user.username)
        await sendLoginMail(user.email, user.username)
        res.status(200).send({status: 200, message: "User logged in", access_token: token, refresh_token: rt.token})
    } catch(_) {
        res.status(500).send({status: 500, message: "Unknown Error"})
    }
})

export default app