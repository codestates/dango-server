import app from '../app';
import config from '../config/index';
import { Server } from 'socket.io';

const port = config.port || 4000;
const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});


const io = new Server(server, { path: '/socket.io', cors: { origin: config.clientURL, methods: ['GET', 'POST'] } });

export default io;

