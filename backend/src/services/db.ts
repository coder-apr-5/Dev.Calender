import { MongoClient, ServerApiVersion } from "mongodb";
import { Events, Tokens, User } from "../validations/schemas";

const client = new MongoClient(process.env.MONGO_DB_URL!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const users = client.db('Primary').collection<User>('Users');
export const tokens = client.db('Primary').collection<Tokens>('Tokens');
export const events = client.db('Primary').collection<Events>('Events');

export const connectDb = () => {
    client.db('Primary').command({ ping: 1 })
    .then(() => console.log('Connected to database'))
    .catch(() => {
        console.log('Failed to connect to database. Please resolve the issue before starting again.')
        process.exit(0)
    })
}