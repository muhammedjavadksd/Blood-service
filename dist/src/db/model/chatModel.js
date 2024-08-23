"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Enum_1 = require("../../Util/Types/Enum");
const messageSchema = new mongoose_1.Schema({
    from: {
        required: true,
        type: String,
        enum: Object.values(Enum_1.ChatFrom)
    },
    timeline: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    }
});
const chatSchema = new mongoose_1.Schema({
    donor_id: {
        type: String,
        required: true
    },
    requirement_id: {
        type: String,
        required: true
    },
    intrest_id: {
        type: String,
        required: true
    },
    profile_one: {
        type: String,
        required: true
    },
    profile_one: {
        type: String,
        required: true
    },
    chat_started: {
        type: String,
        default: new Date()
    },
    chats: {
        type: [messageSchema],
        required: true
    }
});
const ChatCollection = (0, mongoose_1.model)("chat", chatSchema);
exports.default = ChatCollection;
