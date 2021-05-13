// kakao

// kakao gettoken header
export interface KakaoHeader {
  [grant_type: string]: string;
  [client_id: string]: string;
  [redirect_uri: string]: string;
  [code: string]: string;
}
