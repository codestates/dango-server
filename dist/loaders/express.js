"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mylogger_1 = __importDefault(require("../API/middleware/mylogger"));
const key_1 = __importDefault(require("../config/key"));
exports.default = ({ app }) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cookie_parser_1.default());
    app.use(cors_1.default({
        origin: key_1.default.clientURL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    }));
    app.use(mylogger_1.default);
};
