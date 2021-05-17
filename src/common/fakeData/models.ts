const locations = [
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 3.3,
    price: 10000,
  },
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 3.2,
    price: 20000,
  },
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 3.5,
    price: 40000,
  },
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 4.0,
    price: 10000,
  },
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 2.3,
    price: 5000,
  },
  {
    name: 'some where',
    location: { type: 'Point', coordinates: [73.97, 40.77] },
    category: 'P',
    rating: 3.9,
    price: 15000,
  },
];
/*
db.place.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [73.96, 40.76] },
      $minDistance: 1000,
      $maxDistance: 5000,
    }
  }
})

db.talents.find({location: {$near: { $geometry: { type: 'Point', coordinates: [123, 50] }, $minDistance: 1000, $maxDistance: 5000 },}}).sort('price')
*/
const fakeTalent = {
  reviews: [
    {
      nickname: 'SYH',
      rating: 3.5,
      review: '친절하세요',
      reply: '다음에도 이용해주세요',
    },
    {
      nickname: 'SYH',
      rating: 3.5,
      review: '친절하세요',
      reply: '다음에도 이용해주세요',
    },
  ],
  subDetail: 'dnaljsdn',
  images: 'http://pp.pp',
  location: [123, 50],
  city: 'somewhere',
  ratings: [4.3, 7],
  price: 10000,
  category: 'coding',
  title: '코딩 대신 해드립니다.',
};

const fakeUser = {
  nickname: 'kkkkkk',
  socialData: {
    id: 1679231556, //
    social: 'kakao', // change
    name: 'nickname', //
    email: 'qwer@qwer.qw',
    image: 'https://placeimg.com/120/120/people/grayscale',
  },
  selling: [],
  bought: [],
};

export {
  fakeTalent,
  fakeUser,
};
