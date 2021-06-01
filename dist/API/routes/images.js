"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../controller/imgages/upload"));
const uploadImageToS3_1 = __importDefault(require("../middleware/uploadImageToS3"));
const router = express_1.Router();
router.post('/upload', uploadImageToS3_1.default, upload_1.default);
exports.default = router;
