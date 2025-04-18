import express from 'express'
import cors from 'cors'
import { connectDb } from './src/services/db'
import fs from 'fs'
import path from 'path'
const app = express()

app.use(cors())
app.use(express.json())

connectDb()
const routesPath = path.join(__dirname, 'src/routes');
const loadRoutes = async () => {
    const files = fs.readdirSync(routesPath);
    for (const file of files) {
      const { default: route } = await import(path.join(routesPath, file));
      app.use(route);
    }
  };


loadRoutes().then(() => {
    app.listen(process.env.PORT || 3000, () => console.log(process.env.NODE_ENV == 'production' ? "Server started" : `Server started at http://localhost:${process.env.PORT || 3000}`))
})