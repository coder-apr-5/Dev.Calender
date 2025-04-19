import { Router } from "express";
import { events } from "../services/db";

const app = Router()

app.get('/api/events', async (req, res) => {
    try {
        const evs = await events.find({userId: req.user?._id}).toArray()
        res.send({status:200, events: evs})
    } catch(_) {
        res.status(500).send({status: 500, message: "Unknown Error"})
    }
})

export default app