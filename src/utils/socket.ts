import { Socket, Server } from 'socket.io';

class WebSockets {
  private users = new Map();

  private online: number = 0;
  connect = (io: Server) => {
    io.on('connection', (client: Socket) => {
      // 클라이언트 objectId : ( _id )
      const clientId = client.handshake.query.clientId;
      // 쿼리로 담겨온 클라이언트 아이디를 소켓아이디와 함께 users에 저장
      this.users.set(clientId, client.id);

      // 클라이언트가 자신 아이디, 자신 채팅방 상대 아이디 배열과 함께 방 생성요청을 보냄
      client.on('joinroom', (otherIds: string[]) => {
        // 상대 아이디 배열을 돌면서 상대 아이디가 users에 저장되어있는지 확인
        otherIds.forEach((otherId) => {
          if (this.users.has(otherId)) {
            // 저장돼있다면 둘다 로그인 상태이므로 방을 만들어준다.

            // 로그인된 채팅방 상대의 소켓 아이디를 찾고,
            const otherSocketId = this.users.get(otherId);
            // 상대방 소켓을 불러온 뒤
            const otherClient = io.of('/').sockets.get(otherSocketId);

            // 방이름을 유일하게 하기 위해 두 사람의 _id를 더해서 유일한 방이름을 만든다.
            const roomname = `${clientId}${otherId}`;

            // 두사람만 들어가있는 방을 생성한다.
            otherClient?.join(roomname);
            client.join(roomname);

            // 테스트용
            io.sockets.in(roomname).emit('hasjoined', otherSocketId);
          }
        });
      });

      // 상대방에게 메세지 보내기
      client.on('messageToOther', (otherId: string, message: string) => {
        // 두 유저의 아이디를 받아와서 메세지를 그 방에 뿌려준다.
        // 누구의 아이디가 앞에있는지 모르므로 두번 체크한다.
        if (client.rooms.has(`${clientId}${otherId}`)) {
          console.log(message);
          io.sockets
            .in(`${clientId}${otherId}`)
            .emit('messageFromOther', `방이름 : ${clientId}${otherId}, 메세지 ${message}`);
        } else if (client.rooms.has(`${otherId}${clientId}`)) {
          io.sockets
            .in(`${otherId}${clientId}`)
            .emit('messageFromOther', `방이름 : ${otherId}${clientId}, 메세지 ${message}`);
        } else {// 온라인 상태인 유저로부터 메세지를 받아왔지만 상대는 온라인이 아닌 경우

        }
      });
      client.on('disconnect', () => {
        this.users.delete(clientId);
        client.rooms.clear();
      });
    });
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
