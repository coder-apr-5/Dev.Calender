import { Router } from "express";
import { refreshAccessToken } from "../utils/tokens";

const app = Router()

app.post('/refreshToken', async (req, res) => {
    try {
        const rt = req.headers.refreshtoken as string
        if (!rt) {
            res.status(401).send({status:401, message:"Refreshing access token needs a valid refresh token."})
            return;
        }
        const token = await refreshAccessToken(rt)
        res.send({status: 200, message: "OK", accessToken: token})
    } catch(_) {
        res.status(501).send({status:501, message: "Unknown error"})
    }
})

export default app