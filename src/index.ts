import { databaseUrl, host, port } from './config/database'
import { AppDataSource } from './data-source'
import * as express from 'express'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'
import * as line from '@line/bot-sdk'
import * as cron from 'node-cron'

import userRouter from './routes/user'
import adminRouter from './routes/admin'
import { Pillbox } from './controllers/pillbox'

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
line.middleware({
  channelSecret: process.env.CHANNEL_SECRET
})

const app = express()
app.use(express.json())
app.use(cookieParser())

const origin = [
  'https://pillbox-frontend.ialwh0.easypanel.host',
  'https://pillbox-frontend.ialwh0.easypanel.host/',
  'https://pillbox.santijit.dev/',
  'https://pillbox.santijit.dev',
  'http://localhost:5173'
]
app.use(
  cors({
    origin: origin,
    credentials: true
  })
)

app.use('/user', userRouter)
app.use('/admin', adminRouter)

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Database connected to ${host}`)
      console.log(`Server started at http://localhost:${port}`)
      cron.schedule('0 0 * * *', () => {
        const pillbox = new Pillbox()
        pillbox.resetTime()
      })
    })
  })
  .catch((error) => console.log(error))
