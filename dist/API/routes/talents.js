"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const map_1 = __importDefault(require("../controller/talents/map"));
const create_1 = __importDefault(require("../controller/talents/create"));
const preview_1 = __importDefault(require("../controller/talents/preview"));
const detail_1 = __importDefault(require("../controller/talents/detail"));
const review_1 = __importDefault(require("../controller/talents/review"));
const reply_1 = __importDefault(require("../controller/talents/reply"));
const edit_1 = __importDefault(require("../controller/talents/edit"));
const router = express_1.Router();
router.post('/map', map_1.default);
router.post('/create', create_1.default);
router.get('/preview/:talentId', preview_1.default);
router.get('/detail/:talentId', detail_1.default);
router.post('/edit', edit_1.default);
router.post('/review', review_1.default);
router.post('/reply', reply_1.default);
exports.default = router;
/*
'/talents/map'
'/talents/preview'
'/talents/create'
'/talents/detail'-get

'/talents/edit' - post
'/talents/review/:talentId'-post
'/talents/reply/:userId'-post

*/
