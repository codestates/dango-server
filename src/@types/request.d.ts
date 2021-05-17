export interface CreateTalent {
  userId?:string;
  title:string;
  location:number[];
  address:string;
  category:string;
  price:number;
  description:string;
  images:string[];
}