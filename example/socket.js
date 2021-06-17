import io from 'socket.io-client';

const socket1 = io.connect('http://localhost:4000?clientId=user1-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
});

const socket2 = io.connect('http://localhost:4000?clientId=user2-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
});

const socket3 = io.connect('http://localhost:4000?clientId=user3-Oid', {
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket'],
});
export { socket1, socket2, socket3 };
