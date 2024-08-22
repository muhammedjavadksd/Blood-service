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
const chatModel_1 = __importDefault(require("../db/model/chatModel"));
class ChatRepository {
    constructor() {
        this.chatCollection = chatModel_1.default;
    }
    findChatMyChat(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myChat = yield this.chatCollection.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                from_profile_id: profile_id
                            },
                            {
                                to_profile_id: profile_id,
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        intrest_id: { $toObjectId: "$intrest_id" } // Convert string to ObjectId
                    }
                },
                {
                    $lookup: {
                        from: "donors",
                        foreignField: "donor_id",
                        localField: "donor_id",
                        as: "donor"
                    }
                },
                {
                    $lookup: {
                        from: "blood_requirements",
                        foreignField: "blood_id",
                        localField: "requirement_id",
                        as: "blood_requirements"
                    }
                },
                {
                    $addFields: {
                        blood_intrest: { $arrayElemAt: ['$blood_intrest', 0] },
                        donor: { $arrayElemAt: ['$donor', 0] },
                        blood_requirements: { $arrayElemAt: ['$blood_requirements', 0] }
                    }
                }
            ]);
            //     await this.chatCollection.find({
            //     $or: [{
            //         from_profile_id: profile_id
            //     },
            //     {
            //         to_profile_id: profile_id,
            //     }]
            // })
            console.log(myChat);
            return myChat;
        });
    }
    createChat(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            const newChat = new this.chatCollection(chat);
            const insert = yield newChat.save();
            return insert.id;
        });
    }
    findChatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findChat = yield this.chatCollection.findById(id);
            return findChat;
        });
    }
    addMessageToChat(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const addMessage = yield chatModel_1.default.updateOne({ id: chatId }, { $push: { chats: message } });
            return addMessage.modifiedCount > 0;
        });
    }
}
exports.default = ChatRepository;
