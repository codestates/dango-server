// example
import mongoose from 'mongoose';

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
}

export interface Talent {
  userInfo: {
    ref: string;
    _id: boolean;
    type: typeof mongoose.Schema.Types.ObjectId;
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
    _id: typeof mongoose.Schema.Types.ObjectId;
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

// 구매중 구매완료?
//
