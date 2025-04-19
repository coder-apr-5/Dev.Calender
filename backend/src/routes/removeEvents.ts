import { Router, type RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { events } from "../services/db";

const app = Router()
const schema = z.object({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId)
})
const removeValidate: RequestHandler = (req, res, next) => {
    const event = schema.safeParse(req.body)
    if(!event.success) {
        res.status(400).send({status: 400, message: "Invalid event id."})
        return
    }
    req.body = event.data
    next()
}

app.delete('/api/events', removeValidate, async (req, res) => {
    try {
        const { _id } = req.body
        const ev = await events.findOne({_id})
        if(!ev || ev?.userId != req.user?._id) {
            res.status(404).send({status:404, message: "Event not found."})
            return
        }
        await events.deleteOne({_id})
        res.status(204).send({status: 204, message: "Event deleted."})
    } catch(_) {
        res.status(500).send({status: 500, message: "Unknown Error"})
    }
})

export default app