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
const finishdeal_1 = __importDefault(require("../utils/finishdeal"));
class WebSockets {
    constructor() {
        this.users = new Map();
        this.inchat = new Map();
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
                this.inchat.set(clientId, null);
                const createRoom = (userId, otherId) => {
                    // 저장돼있다면 둘다 로그인 상태이므로 방을 만들어준다.
                    // 로그인된 채팅방 상대의 소켓 아이디를 찾고,
                    const otherSocketId = this.users.get(otherId);
                    // 상대방 소켓을 불러온 뒤
                    const otherClient = io.of('/').sockets.get(otherSocketId);
                    // 방이름을 유일하게 하기 위해 두 사람의 _id를 더해서 유일한 방이름을 만든다.
                    const roomname = [userId, otherId].sort().join('');
                    // 두사람만 들어가있는 방을 생성한다.
                    otherClient === null || otherClient === void 0 ? void 0 : otherClient.join(roomname);
                    client.join(roomname);
                    console.log('방 아이디', roomname);
                    // 테스트용
                    io.sockets.in(roomname).emit('hasjoined', otherSocketId);
                    return { roomname, otherSocketId };
                };
                // 클라이언트가 자신 아이디, 자신 채팅방 상대 아이디 배열과 함께 방 생성요청을 보냄
                client.on('joinroom', (otherIds, isSeller) => {
                    // 상대 아이디 배열을 돌면서 상대 아이디가 users에 저장되어있는지 확인
                    otherIds.forEach((otherId) => {
                        if (this.users.has(otherId)) {
                            createRoom(clientId, otherId);
                        }
                    });
                });
                // 상대방에게 메세지 보내기
                client.on('messageToOther', (otherId, message, roomId, isStart) => __awaiter(this, void 0, void 0, function* () {
                    // 두 유저의 아이디를 받아와서 메세지를 그 방에 뿌려준다.
                    // 누구의 아이디가 앞에있는지 모르므로 두번 체크한다.
                    // 지속적인 채팅방 요청응답
                    const messageForm = yield chatmessages_1.default.createPost(roomId, message, clientId);
                    console.log(messageForm);
                    const roomname = [clientId, otherId].sort().join('');
                    if (client.rooms.has(roomname)) {
                        /////////////////////////// 나중에 join(talentId) 추가해야됨.
                        // 다른 사람이 온라인이면 읽음처리를 해줘야됨.
                        io.sockets.in(roomname).emit('messageFromOther', messageForm);
                    }
                    else {
                        // 온라인 상태인 유저로부터 메세지를 받아왔지만 상대는 온라인이 아닌 경우
                        client.emit('messageFromOther', messageForm);
                        // io.sockets.in(`${otherId}${clientId}`).emit('messageFromOther', messageForm);
                    }
                }));
                client.on('initChat', (otherId, roomId, isLeave) => __awaiter(this, void 0, void 0, function* () {
                    const messageForm = isLeave
                        ? yield chatmessages_1.default.createPost(roomId, '', clientId, undefined, false)
                        : yield chatmessages_1.default.createPost(roomId, '', clientId, undefined, true);
                    console.log(messageForm);
                    if (this.inchat.has(otherId)) {
                        const otherSocketId = this.users.get(otherId);
                        const otherClient = io.of('/').sockets.get(otherSocketId);
                        const roomname = [clientId, otherId].sort().join('');
                        // 실시간 채팅방 형성
                        otherClient === null || otherClient === void 0 ? void 0 : otherClient.join(roomname);
                        client.join(roomname);
                        console.log('방 아이디', roomname);
                        // 테스트용
                        io.sockets.in(roomname).emit('hasjoined', otherSocketId);
                        // 생성 메세지 전송
                        io.sockets.in(roomname).emit('messageFromOther', messageForm);
                    }
                    else {
                        client.emit('messageFromOther', messageForm);
                    }
                }));
                client.on('updateReadBy', (otherId, roomId) => __awaiter(this, void 0, void 0, function* () {
                    const readResult = yield chatmessages_1.default.updateReadBy(roomId, otherId);
                }));
                client.on('confirm', (talentId, userId, chatroomId, otherId) => __awaiter(this, void 0, void 0, function* () {
                    const messageForm = yield finishdeal_1.default(talentId, userId, chatroomId);
                    if (!messageForm)
                        return;
                    if (this.users.has(otherId)) {
                        // 로그인 돼있다는건 상대방이나 자신이 이미 createRoom 요청을 수행한 상태
                        const roomname = [userId, otherId].sort().join('');
                        io.sockets.in(roomname).emit('messageFromOther', messageForm, talentId);
                    }
                    else {
                        client.emit('messageFromOther', messageForm, talentId);
                    }
                }));
                client.on('joinchat', (otherId, roomId) => {
                    // 해당 유저가 해당 방에 있다는 정보를 저장한다
                    this.inchat.set(clientId, roomId);
                    if (this.inchat.get(otherId) === roomId) {
                        // 둘이 같은 채팅방 안에 있다.
                        // 둘 모두에게 otherIsJoined === true로 보내줌
                        const otherSocketId = this.users.get(otherId);
                        const otherClient = io.of('/').sockets.get(otherSocketId);
                        otherClient === null || otherClient === void 0 ? void 0 : otherClient.emit('otherIsJoined', clientId, roomId, true);
                        client.emit('otherIsJoined', otherId, roomId, true);
                    }
                    else {
                        // 둘이 다른방에 있다.
                        // 다른사람에겐 굳이 보낼 필요가 없다.
                        client.emit('otherIsJoined', otherId, roomId, false);
                    }
                });
                //
                client.on('leavechat', (otherId, roomId) => {
                    this.inchat.set(clientId, null);
                    if (this.inchat.get(otherId) === roomId) {
                        // 해당방에 상대방이 있는 경우이므로 상대방 유저에게 상대가 나갔음을 보내줘야됨
                        const otherSocketId = this.users.get(otherId);
                        const otherClient = io.of('/').sockets.get(otherSocketId);
                        otherClient === null || otherClient === void 0 ? void 0 : otherClient.emit('otherIsJoined', otherId, roomId, false);
                    } // 아닌 경우 보내줄 필요 없고 joinchat할때 확인하면됨
                });
                // Joinchat => 상대방에게 내가 들어갔는지 보내줌 => otherIsJoined로 true 보내줌
                // 내가 들어간 방의 상대방에게 이벤트 보내야됨
                // joinchat 내가 나간상태인데 상대방이 joinchat 실행할 경우
                // 상대방 아이디 필요하고
                // Leavechat => 상대방에게 내가 나갔는지 알려줌=> otherIsJoined로 false 보내줌
                client.on('disconnect', () => {
                    this.users.delete(clientId);
                    this.inchat.delete(clientId);
                    client.rooms.clear();
                });
                console.log(this.users);
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
