import { model, Schema } from "mongoose";
import { ChatFrom } from "../../Util/Types/Enum";
import { IChatCollection } from "../../Util/Types/Interface/ModelInterface";

const messageSchema = new Schema({
    from: {
        required: true,
        type: String,
        enum: Object.values(ChatFrom)
    },
    timeline: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    }
})

const chatSchema = new Schema({
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
    chat_started: {
        type: String,
        default: new Date()
    },
    chats: {
        type: [messageSchema],
        required: true
    }
})

const ChatCollection = model<IChatCollection>("chat", chatSchema)

export default ChatCollection