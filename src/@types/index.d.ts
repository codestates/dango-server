import mongoose from 'mongoose';
const objectId = typeof mongoose.Schema.Types.ObjectId;

// mongoose schema
export interface User {
  _id: objectId;
  nickname: string;
  socialData: {
    id: number;
    social: string;
    name: string;
    email: string;
    image: string;
  };
  selling: string[];
  buying: [{ _id: string; confirmed: string[] }];
  unreviewed: string[];
  reviewed: [{ _id: string; reviewId: string }];
  talks: string[];
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
  ratings: number[];
  address: string;
  category: string;
  price: number;
  description: string;
  reviews: Review[];
}

export interface Review {
  _id: User;
  reviewId: string;
  nickname: string; // 참조로 바꿔서 나중에 다른 데이터들도 가져올 수 있게.
  rating: number;
  review: string;
  date: Date;
  reply?: Reply;
}
export interface Reply {
  replyDescription: string;
  replyDate: Date;
}

export interface ChatRoom {
  _id: string;
  others: string[];
  talentId: string;
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

export interface UserInfo {
  _id: string;
  nickname: string;
  socialData: {
    id: number;
    social: string;
    name: string;
    email: string;
    image: string;
  };
}
