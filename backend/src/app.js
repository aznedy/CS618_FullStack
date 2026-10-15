import express from 'express'
import { postRoutes } from './routes/posts.js'
const app = express()
postRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello From Express!')
})

export { app }
