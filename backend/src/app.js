import express from 'express'
import { postRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())

postRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello From Express!')
})

export { app }
