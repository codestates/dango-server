import mongoose from 'mongoose';
const objectId = typeof mongoose.Schema.Types.ObjectId;

// mongoose schema
export interface User {
  nickname: string;
  socialData: {
    id: number;
    social: string;
    name: string;
    email: string;
    image: string;
  };
  selling: string[];
  bought: string[];
  talks:string[];
}

export interface Talent {
  userInfo: {
    ref: string;
    _id: boolean;
    type: objectId;
    required: boolean;
  };
  reviews: Review[];
  description: string;
  images: string[];
  location: number[];
  address: string;
  ratings: number[];
  price: number;
  category: string;
  title: string;
}

export interface PopulatedTalent {
  userInfo: {
    _id: objectId;
    nickname: string;
    socialData: {
      id?: number;
      social?: string;
      name?: string;
      email: string;
      image: string;
    };
  };
}

export interface Review {
  nickname: string; // 참조로 바꿔서 나중에 다른 데이터들도 가져올 수 있게.
  rating: number;
  review: string;
  reply?: string;
}

export interface ChatRoom {
  _id: string;
  others: string[];
  type: string;
  initiator: string;
}

export interface ReadBy {
  readUser: string;
  readAt: Date;
}

export interface Message {
  _id: string;
  roomId: String;
  message: any;
  type: string;
  postedBy: string;
  readBy: mongoose.Schema[];
}
