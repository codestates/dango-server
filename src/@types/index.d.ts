// example

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
