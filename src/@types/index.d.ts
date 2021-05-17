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
  reviews:Review[] ;
  description: string;
  images: string[];
  location: number[];
  address:string;
  ratings: number[];
  price: number;
  category: string;
  title: string;
}


export interface Review{
  nickname:string,
  rating:number,
  review:string,
  reply?:string
}

