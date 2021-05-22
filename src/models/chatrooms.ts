import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IChatRoomDocument, IchatRoomModel } from '../@types/roomModels';

const schema: Schema<IChatRoomDocument> = new Schema(
  {
    _id: { type: String, default: () => uuidv4().replace(/\-/g, '') },
    others: [String],
    type: String,
    initiator: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'chatrooms',
  },
);
schema.statics.getchatRoomsByUserId = async function(userId: string) {
  try{
    // 방이랑 상대방 유저Id랑 몇개 안읽었는지 확인 핗요
    return this.find()
    
  } catch(err){
    console.log(err);
  }
};

const ChatRoomModel = model<IChatRoomDocument, IchatRoomModel>('chatrooms', schema);

export default ChatRoomModel;
