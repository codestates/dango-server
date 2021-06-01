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
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const user_1 = __importDefault(require("./user"));
const schema = new mongoose_1.Schema({
    _id: { type: String, default: () => uuid_1.v4().replace(/\-/g, '') },
    users: [String],
    talentId: String,
    type: { type: String, default: '1 to 1' },
    initiator: { type: String, required: true },
}, {
    timestamps: true,
    collection: 'chatrooms',
});
schema.statics.generateChatRooms = function (userId, otherId, talentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRoom = yield this.create({
                talentId,
                users: [otherId, userId],
                initiator: userId,
            });
            if (newRoom) {
                yield user_1.default.updateOne({ _id: userId }, { $push: { talks: newRoom._id, buying: { _id: talentId, confirmed: [] } } });
                yield user_1.default.updateOne({ _id: otherId }, { $push: { talks: newRoom._id } });
            }
            return newRoom._id;
        }
        catch (err) {
            console.log(err);
        }
    });
};
const ChatRoomModel = mongoose_1.model('chatrooms', schema);
exports.default = ChatRoomModel;
