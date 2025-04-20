import {Router} from 'express'
import { verifyAccessToken } from '../utils/tokens'

const app = Router()

app.get('/verify', (req, res) => {
    if(verifyAccessToken(req.headers.authorization?.split(" ")[0] as string)) {
        res.status(200).send({status: 200, message: "OK"})
    } else {
        res.status(401).send({status: 401, message: "Invalid token"})
    }
})

export default app