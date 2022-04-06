//-------- configration ---------//

const http = require('http')
const path = require('path')
var Twitter = require('twitter');
const express = require('express')
const socketIo = require('socket.io')
const config = require('dotenv').config()

// --------- assigning values to variables --------//

const PORT = process.env.PORT || 3000
const app = express()


//----- initialize objects of classes ----------//
const server = http.createServer(app)

const io = socketIo(server)

    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
  //----------- End point for User -----------//
    app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, './', 'client', 'index.html'))
    })
   
    // --------------- Geting live Streams -------------//
    function streamTweets(socket) {
        var stream = client.stream('statuses/filter', {track: 'javascript'});
        stream.on('data', function(tweet) {
          try {
              socket.emit('tweet', tweet)
            } catch (error) {}
        });
         return stream
    }

     //------------- Sending live data --------------//
        io.on('connection',  () => {
          console.log('Client connected...')

          const filteredStream = streamTweets(io)

          let timeout = 0
          filteredStream.on('timeout', () => {
            // Reconnect on error
            console.warn('A connection error occurred. Reconnecting…')
            setTimeout(() => {
              timeout++
              streamTweets(io)
          }, 2 ** timeout)
          streamTweets(io)
          })
        })
  
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`))