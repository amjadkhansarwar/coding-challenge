const http = require('http')
const path = require('path')
var Twitter = require('twitter');
const express = require('express')
const socketIo = require('socket.io')
const needle = require('needle')
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN
const PORT = process.env.PORT || 3000

const app = express()


const server = http.createServer(app)
const io = socketIo(server)


  
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`))