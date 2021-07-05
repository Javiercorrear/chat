const express = require( 'express' )
const path = require( 'path' )
const ejs = require( 'ejs' )

const app = express()
const server = require( 'http' ).createServer( app )
const io = require( 'socket.io' )( server, { cors: { origin: '*' } } )

const PORT = process.env.PORT || 3000

app.use( express.static( path.join( __dirname, 'public' ) ) )
app.set( 'views', path.join( __dirname, 'public' ) )
app.engine( 'html', ejs.renderFile )
app.set( 'view engine', 'html' )

app.use( '/', ( req, res ) => {
    res.render( 'index.html' )
} )

const messages = []

io.on( 'connection', socket => {
  console.log( 'Connected socket: ', socket.id )

  socket.emit( 'previousMessages', messages )

  socket.on( 'sendMessage', data => {
    messages.push( data )
    socket.broadcast.emit( 'receivedMessage', data )
  } )
} )

server.listen( PORT, () => console.log( `Server running on port ${ PORT }` ) )
