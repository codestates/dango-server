import { v4 as uuidv4 } from 'uuid';

const userInfo = {
  id: 1679231526,
  connected_at: '2021-05-13T14:57:33Z',
  properties: {
    nickname: '신영호2',
  },
  kakao_account: {
    profile_needs_agreement: false,
    profile: {
      nickname: '신영호2',
      is_default_image: true,
    },
    has_email: true,
    email_needs_agreement: false,
    is_email_valid: true,
    is_email_verified: true,
    email: 'dydh3333@naver.com',
    has_gender: true,
    gender_needs_agreement: false,
    gender: 'male',
  },
};

const userInfo2 = {
  id: 1679231556,
  connected_at: '2021-05-13T15:02:27Z',
  kakao_account: {
    profile_needs_agreement: false,
    has_email: true,
    email_needs_agreement: true,
    has_gender: true,
    gender_needs_agreement: true,
  },
};

const user2 = {
  nickname: 'ABC',
  socialData: {
    id: 12314124512,
    social: 'kakao',
    name: '이영호',
    email: 'qwer@qwer.qw',
    image: 'https://placeimg.com/120/120/people/grayscale',
  },
};

const room = {
  _id: uuidv4().toString(),
  others: ["60a631d45e496eae79fc9c01"],
  type:"this",
  initiator:"609ec5a42b6cd4396e5d2bcf"
};
