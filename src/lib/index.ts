import io from '../bin/www';
import { Socket } from 'socket.io';

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
