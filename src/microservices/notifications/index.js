const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();


const io = new Server(httpServer, { cors: { 
  origin: '*',
  allowedHeaders: ["session-id"] } 
});


io.on('connection', (socket) => {
  console.log('a user connected', socket.handshake.headers);
  //const sessionId = socket.handshake.headers['session-id'];

  // socket.emit('connection',{
  //   message:`wellcome user - ${sessionId}`
  // })
  socket.on('notify', (data) => {
    console.log(data)
    io.emit(['notify',data.toUsers], data);
  });
});

httpServer.listen(4000, () => {
  console.log('listening on *:4000');
});