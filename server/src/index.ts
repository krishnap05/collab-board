import express from 'express'
import cors from 'cors'
import boardsRouter from './routes/boards'
import { initDb } from './db/init'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/api/boards', boardsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})