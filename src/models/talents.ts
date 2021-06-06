import { Talent } from './../@types/index.d';
import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schema = new Schema<Talent>({
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
    _id: false,
  },
  reviews: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'users' },
      reviewId: { type: String, default: () => uuidv4().replace(/\-/g, '') },
      nickname: { type: String, required: true },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
      date: { type: String, required: true },
      reply: {
        replyDescription: { type: String, required: false },
        replyDate: { type: String, required: false },
        required: false,
      },
      required: false,
    },
  ],
  description: { type: String, required: true },
  images: { type: [String], required: false },
  location: { type: [Number], required: true, index: '2dsphere' },
  address: { type: String, required: true },
  ratings: { type: [Number], required: true, default: [0, 0] },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
});
schema.index({ location: '2dsphere' });

const TalentModel = model<Talent>('talents', schema);

export default TalentModel;
