import { KakaoHeader } from './../@types/service.d';
import axios, { AxiosResponse } from 'axios';
import config from '../config/key';
import logger from '../log/winston';

export default class KakaoAuth {
  static async getTokenWithCode(code: string) {
    const kakaoHeader = {
      Authorization: config.kakaoAdminKey,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    return async () => {
      const data: KakaoHeader = {
        grant_type: 'authorization_code',
        client_id: config.kakaoRestAPIKey,
        redirect_uri: config.redirectURI,
        code: code,
      };
      const queryString = Object.keys(data)
        .map((k: string) => `${k}=${data[k]}`)
        .join('&');
      return await axios
        .post('https://kauth.kakao.com/oauth/token', queryString, { headers: kakaoHeader })
        .then((res: AxiosResponse) => res.data)
        .catch((err) => {
          logger.debug(`${__dirname} kakaoAuth/getToken err message :: ${err.message}`);
        });
    };
  }
  static async getUserInfo(token: string) {
    return axios
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => res.data)
      .catch((err) => {
        logger.debug(`${__dirname} kakaoAuth/getUserInfo err message :: ${err.message}`);
      });
  }
  static async signOut(token: string) {
    return axios
      .post('https://kapi.kakao.com/v1/user/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => res.data)
      .catch((err) => {
        logger.debug(`${__dirname} kakaoAuth/signout err message :: ${err.message}`);
      });
  }
  static async withdraw(token: string) {
    return axios
      .post('https://kapi.kakao.com/v1/user/unlink', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => {
        return res.data;
      })
      .catch((err) => {
        logger.debug(`${__dirname} kakaoAuth/withdraw err message :: ${err.message}`);
      });
  }
  static async validate(token: string) {
    return axios
      .get('https://kapi.kakao.com/v1/user/access_token_info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => {
        return res.data;
      })
      .catch((err) => {
        logger.debug(`${__dirname} kakaoAuth/validate err message :: ${err.message}`);
      });
  }
}
