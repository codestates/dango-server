"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../controller/users/kakao/index");
const withdraw_1 = __importDefault(require("../../controller/users/withdraw"));
const router = express_1.Router();
router.post('/signup', index_1.signup);
router.post('/signin', index_1.signin);
router.post('/signout', index_1.signout);
router.delete('/withdrawal', withdraw_1.default);
exports.default = router;
