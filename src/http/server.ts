import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { v4 } from 'uuid'

import env from '../environment/env'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors({
  origin: '*'
}))

io.on('connection', (socket) => {
  let clientId = v4()
  if (socket.handshake.auth.clientId) {
    clientId = socket.handshake.auth.clientId
  }
  socket.emit('connected', {
    clientId
  })

  socket.on('join', (data) => {
    io.emit('join', data)
  })

  socket.on('message', (data) => {
    io.emit('message', data)
  })
})

app.use(express.static('public'))

const port = env.PORT

server.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port} 🚀`)
})
