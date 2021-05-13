import app from '../app';
import config from '../config/index';
import { Server, Socket } from 'socket.io';

const port = config.port || 4000;
const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});


const io = new Server(server, { path: '/socket.io', cors: { origin: config.clientURL, methods: ['GET', 'POST'] } });

const c = {
  generate: () => {
    io.of('/').adapter.on('create-room', (room) => {
      console.log(`room ${room} was created`);
    });
  },
  join: () => {
    io.of('/').adapter.on('join-room', (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
  },
  connect: () => {
    io.on('connection', (socket: Socket) => {
      console.log(5);
      socket.on('message', function (message: string) {
        console.log(socket.id);
        console.log(message);
      });
    });
  },
};
