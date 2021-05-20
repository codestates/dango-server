import io from 'socket.io-client';

const socket1 = io.connect('http://localhost:4000?clientId=user1-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
  // 위의 설정을 통해 폴링을 한 후가 아닌 처음 부터 바로 웹 소켓을 사용할 수 있다.
});

const socket2 = io.connect('http://localhost:4000?clientId=user2-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
  // 위의 설정을 통해 폴링을 한 후가 아닌 처음 부터 바로 웹 소켓을 사용할 수 있다.
});

const socket3 = io.connect('http://localhost:4000?clientId=user3-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
  // 위의 설정을 통해 폴링을 한 후가 아닌 처음 부터 바로 웹 소켓을 사용할 수 있다.
});
export { socket1, socket2, socket3 };
