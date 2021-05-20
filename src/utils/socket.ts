import { Socket, Server } from 'socket.io';

class WebSockets {
  private users = new Map();

  private online: number = 0;
  connect = (io: Server) => {
    io.on('connection', (client: Socket) => {
      // console.log(client.handshake.query.ClientId);
      this.users.set(client.handshake.query.ClientId, client.id);
      console.log(this.users);
      client.on('NewPlayer', (data1: string) => {
        console.log(client.rooms)
      });

      client.on('DelPlayer', (data) => {
        console.log('Adios' + data);
      });

      client.on('joinroom', (clientId: string, otherId: string[]) => {
        otherId.forEach((id) => {
          if (this.users.has(id)) {
            const connected = this.users.get(id);
            const a = io.of('/').sockets.get(connected);
            a?.join(`${this.users.get(clientId)}${connected}`);
            client.join(`${this.users.get(clientId)}${connected}`)
          }
        });
      });

      client.on('disconnect', (data) => {
        this.users.delete(client.handshake.query.ClientId);
        console.log(client.rooms)

      });
    });
    // io.sockets.on('connection', (socket: string) => {
    //   this.users.push(socket);

    //   socket.on('disconnect', () => {
    //     console.log('Got disconnect!');

    //     var i = this.users.indexOf(socket);
    //     this.users.splice(i, 1);
    //   });
    // });
  };
  generate = (io: Server) => {
    io.of('/').adapter.on('create-room', (room) => {
      console.log(`room ${room} was created`);
    });
  };
  join = (io: Server) => {
    io.of('/joinroom').adapter.on('join-room', (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
  };
}

export default new WebSockets();

/**
 * io.on('connection',callback) : 서버와 클라이언트의 소켓이 연결되었을 때 실행
 * socket.on('이벤트명', 콜백) ::: 이벤트명?
 * ['objectId1', 'objectId2']
 */
