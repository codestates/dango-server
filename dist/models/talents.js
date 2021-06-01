"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const schema = new mongoose_1.Schema({
    userInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: false,
        _id: false,
    },
    reviews: [
        {
            _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
            reviewId: { type: String, default: () => uuid_1.v4().replace(/\-/g, '') },
            nickname: { type: String, required: true },
            rating: { type: Number, required: true, default: [0, 0] },
            review: { type: String, required: true },
            date: { type: String, required: true },
            reply: {
                replyDescription: { type: String, required: false },
                replyDate: { type: String, required: false },
                required: false,
            },
            required: false,
        },
    ],
    description: { type: String, required: true },
    images: { type: [String], required: false },
    location: { type: [Number], required: true, index: '2dsphere' },
    address: { type: String, required: true },
    ratings: { type: [Number], required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
});
// schema.index({ location: '2dsphere' });
const TalentModel = mongoose_1.model('talents', schema);
exports.default = TalentModel;
