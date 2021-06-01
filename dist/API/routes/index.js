"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./users/users"));
const talents_1 = __importDefault(require("./talents"));
const chats_1 = __importDefault(require("./chats"));
const images_1 = __importDefault(require("./images"));
exports.default = {
    users: users_1.default,
    talents: talents_1.default,
    chats: chats_1.default,
    images: images_1.default
};
