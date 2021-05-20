import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ReadBy, Message } from './../@types/index.d';

const readbySchema = new Schema<ReadBy>(
  {
    _id: false,
    readUser: { type: String, required: false },
    readAt: { type: Date, required: true, default: Date.now() },
  },
  {
    timestamps: false,
  },
);

const messageSchema = new Schema<Message>({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ''),
  },
  roomId: String,
  message: Schema.Types.Mixed,
  type: {
    type: String,
    default: 'text',
  },
  postedBy: String,
  readBy: [readbySchema],
});
































const MessageModel = model<Message>("messages", messageSchema)
// const ReadByModel = model<ReadBy>('chatrooms', readbySchema); : 도큐먼트에 저장 안함?
export default MessageModel;
