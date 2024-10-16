import { databaseUrl, host, port } from './config/database'
import { AppDataSource } from './data-source'
import * as express from 'express'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'

import userRouter from './routes/user'
import adminRouter from './routes/admin'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'https://pillbox-frontend.ialwh0.easypanel.host/login',
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
    })
  })
  .catch((error) => console.log(error))
