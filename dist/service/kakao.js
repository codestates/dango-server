"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const key_1 = __importDefault(require("../config/key"));
class KakaoAuth {
    static getTokenWithCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const kakaoHeader = {
                Authorization: key_1.default.kakaoAdminKey,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            };
            return () => __awaiter(this, void 0, void 0, function* () {
                const data = {
                    grant_type: 'authorization_code',
                    client_id: key_1.default.kakaoRestAPIKey,
                    redirect_uri: key_1.default.redirectURI,
                    code: code,
                };
                const queryString = Object.keys(data)
                    .map((k) => `${k}=${data[k]}`)
                    .join('&');
                return yield axios_1.default
                    .post('https://kauth.kakao.com/oauth/token', queryString, { headers: kakaoHeader })
                    .then((res) => res.data)
                    .catch((e) => e);
            });
        });
    }
    static getUserInfo(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.data)
                .catch((e) => e);
        });
    }
    static signOut(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .post('https://kapi.kakao.com/v1/user/logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.data)
                .catch((e) => e);
        });
    }
    static withdraw(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .post('https://kapi.kakao.com/v1/user/unlink', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                return res.data;
            })
                .catch((e) => e);
        });
    }
    static validate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default
                .get('https://kapi.kakao.com/v1/user/access_token_info', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                return res.data;
            })
                .catch((e) => e);
        });
    }
}
exports.default = KakaoAuth;
