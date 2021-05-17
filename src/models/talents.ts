import { Talent } from './../@types/index.d';
import { Schema, model } from 'mongoose';

const schema = new Schema<Talent>({
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
    _id: false,
  },
  reviews: [
    {
      nickname: { type: String, required: true },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
      reply: { type: String, required: false },
    },
  ],
  subDetail: { type: String, required: true },
  images: { type: [String], required: false },
  location: { type: [Number], required: true,index: '2dsphere' },
  city: { type: String, required: true },
  ratings: { type: [Number], required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
});
// schema.index({ location: '2dsphere' });

const TalentModel = model<Talent>('talents', schema);

export default TalentModel;
