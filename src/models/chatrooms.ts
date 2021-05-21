import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoom } from './../@types/index.d';

const schema = new Schema<ChatRoom>(
  {
    _id: { type: String, default: () => uuidv4().replace(/\-/g, "") },
    others: [String],
    type: String,
    initiator: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'chatrooms',
  },
);

const ChatRoomModel = model<ChatRoom>('chatrooms', schema);

export default ChatRoomModel;
