import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bskyRoutes from './routes/bskyRoutes' // Ajuste o caminho conforme sua estrutura

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api', bskyRoutes)

// Iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})