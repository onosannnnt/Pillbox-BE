import { host, port } from "./config/database"
import { AppDataSource } from "./data-source"
import * as express from "express"
import * as cors from "cors"

const app = express()
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))

AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Database connected to ${host}`)
        console.log(`Server started at http://localhost:${port}`)
    })

}).catch(error => console.log(error))
