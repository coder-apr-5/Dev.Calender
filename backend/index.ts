
import express from 'express'
import cors from 'cors'
import { connectDb } from './src/services/db'
import fs from 'fs'
import path from 'path'
import { User } from './src/validations/schemas'
import authMiddleware from './src/middlewares/auth'
import tokensHandlerMiddleware from './src/middlewares/tokensHandler'
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', tokensHandlerMiddleware, authMiddleware)

connectDb()

declare global {
  namespace Express {
      interface Request {
          user?: User
      }
  }
}

const routesPath = path.join(__dirname, 'src/routes');
const loadRoutes = async () => {
    const files = fs.readdirSync(routesPath);
    for (const file of files) {
      const { default: route } = await import(path.join(routesPath, file));
      app.use(route);
    }
  };


loadRoutes().then(() => {
    app.listen(process.env.PORT || 3000, () => console.log(process.env.NODE_ENV == 'production' ? "Server started" : `Server started at ${process.env.APP_URL}`))
})
