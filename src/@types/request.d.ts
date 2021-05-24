export interface CreateTalent {
  userId?: string;
  title: string;
  location: number[];
  address: string;
  category: string;
  price: number;
  description: string;
  images: string[];
}

export interface Review {
  talentId: string;
  userId: string;
  nickname: string;
  rating: number;
  review: string;
}
//talentId, userId, review, rating, nickname