"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getChat_1 = __importDefault(require("../controller/chat/getChat"));
const createRoom_1 = __importDefault(require("../controller/chat/createRoom"));
const endChat_1 = __importDefault(require("../controller/chat/endChat"));
const router = express_1.Router();
router.post('/createchat', createRoom_1.default);
router.post('/:roomId', getChat_1.default);
router.delete('/delete', endChat_1.default);
exports.default = router;
