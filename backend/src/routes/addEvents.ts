import { Router, type RequestHandler } from "express";
import { Events } from "../validations/schemas";
import { events } from "../services/db";

const app = Router()

const newEventValidate: RequestHandler = (req, res, next) => {
    let event = Events.safeParse(req.body)
    if(!event.success) {
        res.status(400).send(event.error.issues)
        return
    }
    req.body = event.data
    next()
}

app.post('/api/events', newEventValidate, async (req, res) => {
    try {
        let {timeStart, name, description, isAllDay} = req.body
        const ev = await events.insertOne({timeStart, name, description, isAllDay, userId: req.user?._id!})
        res.status(201).send({status: 201, message: "Event created", eventId: ev.insertedId})
    } catch(_) {
        res.status(500).send({status: 500, message: "Unknown Error"})
    }
})

export default app