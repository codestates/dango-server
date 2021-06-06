"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'debug',
    transports: [
        new winston_1.default.transports.File({
            filename: 'system.log',
            format: winston_1.default.format.printf(info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
        }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.printf(info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
        })
    ]
});
exports.default = logger;
