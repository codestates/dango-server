import app from '../app';
import config from '../config/key';
import { Server } from 'socket.io';
import WebSockets from '../utils/socket';

const port = config.port || 4000;
const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const io = new Server(server, { path: '/socket.io', cors: { origin: config.clientURL, methods: ['GET', 'POST'] } });

WebSockets.connect(io);
