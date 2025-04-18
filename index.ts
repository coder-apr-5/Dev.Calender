import express from 'express'
import cors from 'cors'
import register from './src/routes/register'
const app = express()

app.use(cors())
app.use(express.json())
app.use(register)


app.listen(3000)