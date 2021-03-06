"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatmessages_1 = __importDefault(require("../models/chatmessages"));
class WebSockets {
    constructor() {
        this.users = new Map();
        this.online = 0;
        this.connect = (io) => {
            io.on('connection', (client) => {
                // 클라이언트 objectId : ( _id )
                console.log('connect starts');
                console.log(client.handshake.query.clientId);
                if (!client.handshake.query.clientId)
                    return;
                const clientId = Array.isArray(client.handshake.query.clientId)
                    ? client.handshake.query.clientId[0]
                    : client.handshake.query.clientId;
                // 쿼리로 담겨온 클라이언트 아이디를 소켓아이디와 함께 users에 저장
                this.users.set(clientId, client.id);
                // 클라이언트가 자신 아이디, 자신 채팅방 상대 아이디 배열과 함께 방 생성요청을 보냄
                client.on('joinroom', (otherIds, isSeller) => {
                    // 상대 아이디 배열을 돌면서 상대 아이디가 users에 저장되어있는지 확인
                    otherIds.forEach((otherId) => {
                        if (this.users.has(otherId)) {
                            // 저장돼있다면 둘다 로그인 상태이므로 방을 만들어준다.
                            // 로그인된 채팅방 상대의 소켓 아이디를 찾고,
                            const otherSocketId = this.users.get(otherId);
                            // 상대방 소켓을 불러온 뒤
                            const otherClient = io.of('/').sockets.get(otherSocketId);
                            // 방이름을 유일하게 하기 위해 두 사람의 _id를 더해서 유일한 방이름을 만든다.
                            const roomname = [clientId, otherId].sort().join('');
                            // 두사람만 들어가있는 방을 생성한다.
                            otherClient === null || otherClient === void 0 ? void 0 : otherClient.join(roomname);
                            client.join(roomname);
                            console.log('방 아이디', roomname);
                            // 테스트용
                            io.sockets.in(roomname).emit('hasjoined', otherSocketId);
                        }
                    });
                });
                // 상대방에게 메세지 보내기
                client.on('messageToOther', (otherId, message, roomId, isStart) => __awaiter(this, void 0, void 0, function* () {
                    // 두 유저의 아이디를 받아와서 메세지를 그 방에 뿌려준다.
                    // 누구의 아이디가 앞에있는지 모르므로 두번 체크한다.
                    if (isStart) {
                        // 새로운 채팅방 요청 응답
                        const messageForm = yield chatmessages_1.default.createPost(roomId, message, clientId, undefined, true);
                        const roomname = [clientId, otherId].sort().join('');
                        if (client.rooms.has(roomname)) {
                            io.sockets.in(roomname).emit('messageFromOther', messageForm);
                        }
                        else {
                            client.emit('messageFromOther', messageForm);
                        }
                    }
                    else {
                        // 지속적인 채팅방 요청응답
                        const messageForm = yield chatmessages_1.default.createPost(roomId, message, clientId);
                        console.log(messageForm);
                        if (client.rooms.has(`${clientId}${otherId}`)) { /////////////////////////// 나중에 join(talentId) 추가해야됨.
                            // 다른 사람이 온라인이면 읽음처리를 해줘야됨.
                            io.sockets.in(`${clientId}${otherId}`).emit('messageFromOther', messageForm);
                        }
                        else if (client.rooms.has(`${otherId}${clientId}`)) {
                            io.sockets.in(`${otherId}${clientId}`).emit('messageFromOther', messageForm);
                        }
                        else {
                            // 온라인 상태인 유저로부터 메세지를 받아왔지만 상대는 온라인이 아닌 경우
                            client.emit('messageFromOther', messageForm);
                            // io.sockets.in(`${otherId}${clientId}`).emit('messageFromOther', messageForm);
                        }
                    }
                }));
                client.on('updateReadBy', (roomId, otherId) => __awaiter(this, void 0, void 0, function* () {
                    yield chatmessages_1.default.updateReadBy(roomId, otherId);
                }));
                // 내가 채팅방 안에 있을 때 메세지가 오면 읽음 요청을 보내야되요
                // 내가 메세지를 읽으면 상대방입장에선 상대방이 채팅방 안에있을때 1을 없애야되고,.... advanced
                client.on('disconnect', () => {
                    this.users.delete(clientId);
                    client.rooms.clear();
                });
                console.log(this.users);
            });
        };
        this.generate = (io) => {
            io.of('/').adapter.on('create-room', (room) => {
                console.log(`room ${room} was created`);
            });
        };
        this.join = (io) => {
            io.of('/joinroom').adapter.on('join-room', (room, id) => {
                console.log(`socket ${id} has joined room ${room}`);
            });
        };
    }
}
exports.default = new WebSockets();
/**
 * 메세지가 오면 db에 저장하고 리턴됨 폼에 맞는 메세지 객체를 리턴
 * 클라는 메세지를 받으면 읽었는지 안읽었는지 구분이 필요함......메세지를 받을 때마다 읽음 요청을 보내고 ...
 *
 */
