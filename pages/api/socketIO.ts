import { NextApiRequest,NextApiResponse } from 'next';
import { Server } from 'socket.io'

interface SocketT {
    socket:{
        server:any
    }
}
const ioHandler = (req:NextApiRequest, res:NextApiResponse&SocketT) => {debugger;
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    io.on('connection', socket => {
      socket.broadcast.emit('a user connected')
      socket.on('hello', msg => {
        socket.emit('hello', 'world!')
      })
      socket.on('test',msg=>{
          socket.emit('test',msg+' !!!')
      })
    })


    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler