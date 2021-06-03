import { Socket, Server } from 'socket.io';
import MessageModel from '../models/chatmessages';
import confirm from '../utils/finishdeal';

class WebSockets {
  private users = new Map();

  private online: number = 0;
  connect = (io: Server) => {
    io.on('connection', (client: Socket) => {
      // 클라이언트 objectId : ( _id )
      console.log('connect starts');
      console.log(client.handshake.query.clientId);
      if (!client.handshake.query.clientId) return;
      const clientId = Array.isArray(client.handshake.query.clientId)
        ? client.handshake.query.clientId[0]
        : client.handshake.query.clientId;
      // 쿼리로 담겨온 클라이언트 아이디를 소켓아이디와 함께 users에 저장
      this.users.set(clientId, client.id);
      const createRoom = (userId: string, otherId: string) => {
        // 저장돼있다면 둘다 로그인 상태이므로 방을 만들어준다.

        // 로그인된 채팅방 상대의 소켓 아이디를 찾고,
        const otherSocketId = this.users.get(otherId);
        // 상대방 소켓을 불러온 뒤
        const otherClient = io.of('/').sockets.get(otherSocketId);

        // 방이름을 유일하게 하기 위해 두 사람의 _id를 더해서 유일한 방이름을 만든다.
        const roomname = [userId, otherId].sort().join('');

        // 두사람만 들어가있는 방을 생성한다.
        otherClient?.join(roomname);
        client.join(roomname);
        console.log('방 아이디', roomname);
        // 테스트용
        io.sockets.in(roomname).emit('hasjoined', otherSocketId);
        return { roomname, otherSocketId };
      };
      // 클라이언트가 자신 아이디, 자신 채팅방 상대 아이디 배열과 함께 방 생성요청을 보냄
      client.on('joinroom', (otherIds: string[], isSeller) => {
        // 상대 아이디 배열을 돌면서 상대 아이디가 users에 저장되어있는지 확인
        otherIds.forEach((otherId) => {
          if (this.users.has(otherId)) {
            createRoom(clientId, otherId);
          }
        });
      });

      // 상대방에게 메세지 보내기
      client.on(
        'messageToOther',
        async (otherId: string, message: string, roomId: string, isStart: boolean | undefined) => {
          // 두 유저의 아이디를 받아와서 메세지를 그 방에 뿌려준다.
          // 누구의 아이디가 앞에있는지 모르므로 두번 체크한다.

          // 지속적인 채팅방 요청응답
          const messageForm = await MessageModel.createPost(roomId, message, clientId);
          console.log(messageForm);
          const roomname = [clientId, otherId].sort().join('');
          if (client.rooms.has(roomname)) {
            /////////////////////////// 나중에 join(talentId) 추가해야됨.
            // 다른 사람이 온라인이면 읽음처리를 해줘야됨.
            io.sockets.in(`${clientId}${otherId}`).emit('messageFromOther', messageForm);
          } else {
            // 온라인 상태인 유저로부터 메세지를 받아왔지만 상대는 온라인이 아닌 경우
            client.emit('messageFromOther', messageForm);
            // io.sockets.in(`${otherId}${clientId}`).emit('messageFromOther', messageForm);
          }
        },
      );
      client.on('initChat', async (otherId: string, roomId: string,) => {
        console.log(1123178236912391719371296);
        const messageForm = await MessageModel.createPost(roomId, '', clientId, undefined, true);
        if (this.users.has(otherId)) {
          const otherSocketId = this.users.get(otherId);
          const otherClient = io.of('/').sockets.get(otherSocketId);
          const roomname = [clientId, otherId].sort().join('');

          // 실시간 채팅방 형성
          otherClient?.join(roomname);
          client.join(roomname);
          console.log('방 아이디', roomname);
          // 테스트용
          io.sockets.in(roomname).emit('hasjoined', otherSocketId);
          // 생성 메세지 전송
          io.sockets.in(roomname).emit('messageFromOther', messageForm);
        } else {
          client.emit('messageFromOther', messageForm);
        }
      });
      client.on('updateReadBy', async (roomId, otherId) => {
        /* 클라이언트가 readBy요청을 보내면 readBy 업데이트해주고 readBy 업데이트 됐다고 알려줘야됨
         *클라이언트는 상대방의 readBy응답을 받으면 읽음으로 렌더링 처리 해줘야 됨
         * 
         * ex) 방법 1
         * 유저1이 채팅창으로 들어오면 updateReadBy 실행
         * 유저1, 유저2가 채팅방 안에 있는경우
         *   : updateReadBy 로 유저1, 유저2에게 읽음처리
         * 유저1, 유저2가 채팅방 안에 있는데 한명이 메세지를 보내는 경우
         *   : 유저1, 유저2 에게 모두 읽음 처리
         * 유저1이 들어와 있는데 유저2는 나가있는 경우 
         *   : 읽음처리 되면 안됨
         * 즉 클라이언트는 채팅창에 들어오면 socket.on('updateReadBy', ... ) 를 실행해야 되지만, 
         * 채팅창에서 나가면 socket.on('updateReadBy', ... )를 꺼야됨 ==> useEffect사용
         * 
         * 
         * ex) 방법2
         * 
        */
        const readResult = await MessageModel.updateReadBy(roomId, otherId);
      });

      client.on('confirm', async (talentId: string, userId: string, chatroomId: string, otherId: string) => {
        const messageForm = await confirm(talentId, userId, chatroomId);
        if (!messageForm) return;
        if (this.users.has(otherId)) { // 로그인 돼있다는건 상대방이나 자신이 이미 createRoom 요청을 수행한 상태
          const roomname = [userId, otherId].sort().join('');
          io.sockets.in(roomname).emit('messageFromOther', messageForm);
        } else {
          client.emit('messageFromOther', messageForm);
        }
      })
      // 내가 채팅방 안에 있을 때 메세지가 오면 읽음 요청을 보내야되요
      // 내가 메세지를 읽으면 상대방입장에선 상대방이 채팅방 안에있을때 1을 없애야되고,.... advanced
      client.on('disconnect', () => {
        this.users.delete(clientId);
        client.rooms.clear();
      });
      console.log(this.users);
    });
  };
}

export default new WebSockets();

/**
 * 메세지가 오면 db에 저장하고 리턴됨 폼에 맞는 메세지 객체를 리턴
 * 클라는 메세지를 받으면 읽었는지 안읽었는지 구분이 필요함......메세지를 받을 때마다 읽음 요청을 보내고 ...
 *
 */