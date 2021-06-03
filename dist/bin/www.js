"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const key_1 = __importDefault(require("../config/key"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("../loaders/socket"));
const port = key_1.default.port || 4000;
const server = app_1.default.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
const io = new socket_io_1.Server(server, { path: '/socket.io', cors: { origin: key_1.default.clientURL, methods: ['GET', 'POST'] } });
socket_1.default.connect(io);
