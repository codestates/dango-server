export interface GooglePayload {
  iss: string,
  azp: string,
  aud: string,
  sub: string,// identifier
  email: string,
  email_verified: true,
  at_hash: string,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  locale: string,
  iat: number,
  exp: number,
  // jti: string
}
/**

 */