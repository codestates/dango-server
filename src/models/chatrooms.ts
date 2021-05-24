import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IChatRoomDocument, IchatRoomModel } from '../@types/roomModels';
import UserModel from './user';

const schema: Schema<IChatRoomDocument> = new Schema(
  {
    _id: { type: String, default: () => uuidv4().replace(/\-/g, '') },
    users: [String],
    type: { type: String, default: '1 to 1' },
    initiator: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'chatrooms',
  },
);

schema.statics.generateChatRooms = async function (userId: string, otherId: string, talentId: string) {
  try {
    const newRoom = await this.create({
      users: [otherId, userId],
      initiator: userId,
    });
    if (newRoom) {
      await UserModel.updateOne(
        { _id: userId },
        { $push: { talks: newRoom._id, buying: { _id: talentId, confirmed: [] } } },
      );
      await UserModel.updateOne({ _id: otherId }, { $push: { talks: newRoom._id } });
    }
    return newRoom._id;
  } catch (err) {
    console.log(err);
  }
};

const ChatRoomModel = model<IChatRoomDocument, IchatRoomModel>('chatrooms', schema);

export default ChatRoomModel;
