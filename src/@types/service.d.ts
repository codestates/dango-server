import { S3Payload } from './service.d';
export interface KakaoHeader {
  [grant_type: string]: string;
  [client_id: string]: string;
  [redirect_uri: string]: string;
  [code: string]: string;
}

export interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties?: {
    nickname: string;
  };
  kakao_account: {
    profile_needs_agreement: boolean;
    profile?: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender?: string;
  };
}

export interface WithdrawKakao {
  msg?: string;
  code?: number;
  id?: string;
}

export interface GooglePayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string; // identifier
  email: string;
  email_verified: true;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  // jti: string
}

export interface transformS3Payload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  transforms: [
    {
      id: string;
      size: number;
      bucket: string;
      key: stirng;
      acl: string;
      contentType: string;
      contentDisposition: any | null;
      storageClass: stirng;
      serverSideEncryption: any | null;
      metadata: any | null;
      location: string;
      etag: string;
    },
  ];
}

export interface S3Payload {
  fieldname: stirng;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: any | null;
  storageClass: string;
  serverSideEncryption: any | null;
  metadata: any | null;
  location: string;
  etag: string;
  versionId: any | undefined;
}
