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
const chatRepo_1 = __importDefault(require("../repo/chatRepo"));
const Enum_1 = require("../Util/Types/Enum");
class ChatService {
    constructor() {
        this.chatRepo = new chatRepo_1.default();
    }
    startChat(from_profile_id, to_profile_id, requirement_id, msg, started, donor_id, intrest_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("To provide id is");
            console.log(to_profile_id);
            const chat = {
                from_profile_id,
                to_profile_id,
                chat_started: new Date(),
                chats: [
                    {
                        from: started,
                        msg,
                        timeline: new Date().toISOString(),
                        seen: false
                    }
                ],
                donor_id: donor_id,
                intrest_id,
                requirement_id
            };
            console.log(chat);
            const saveChat = yield this.chatRepo.createChat(chat);
            if (saveChat) {
                return {
                    status: true,
                    msg: "Chat created success",
                    statusCode: Enum_1.StatusCode.CREATED,
                    data: {
                        chat_id: saveChat
                    }
                };
            }
            else {
                return {
                    status: false,
                    msg: "Chat created failed",
                    statusCode: Enum_1.StatusCode.BAD_REQUEST,
                };
            }
        });
    }
}
exports.default = ChatService;
