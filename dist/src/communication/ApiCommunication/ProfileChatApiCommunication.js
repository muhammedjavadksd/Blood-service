"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class ProfileChat {
    createChatRoom(msg, to_profile, token) {
        axios_1.default.post(`${process.env.PROFILE_END_POINT || ""}/create_chat/profile_id`, { to_profile: to_profile, msg }, { headers: { authorization: `Bearer ${token}` } }).then(() => true).catch((e) => {
            console.log(e);
            return false;
        });
    }
}
exports.default = ProfileChat;
