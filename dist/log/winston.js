"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const env = process.env.NODE_ENV;
if (!fs_1.default.existsSync('logs')) {
    fs_1.default.mkdirSync('logs');
}
const logger = winston_1.default.createLogger({
    level: 'debug',
    transports: [
        new winston_1.default.transports.File({
            filename: './logs/system.log',
            format: winston_1.default.format.printf(info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
        }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.printf(info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
        })
    ]
});
exports.default = logger;
