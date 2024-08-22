import { ObjectId } from "mongoose";
import { IChatCollection, IChatTemplate, IMessageTemplate } from "../Util/Types/Interface/ModelInterface";
import ChatCollection from "../db/model/chatModel";


interface IChatRepo {
    createChat(chat: IChatTemplate): Promise<ObjectId | null>
    findChatById(id: string): Promise<IChatCollection | null>
    addMessageToChat(chatId: string, message: IMessageTemplate): Promise<boolean>
}


class ChatRepository implements IChatRepo {

    chatCollection;

    constructor() {
        this.chatCollection = ChatCollection;
    }

    async createChat(chat: IChatTemplate): Promise<ObjectId | null> {
        const newChat = new this.chatCollection(chat);
        const insert = await newChat.save();
        return insert.id
    }

    async findChatById(id: string): Promise<IChatCollection | null> {
        const findChat = await this.chatCollection.findById(id);
        return findChat;
    }

    async addMessageToChat(chatId: string, message: IMessageTemplate): Promise<boolean> {
        const addMessage = await ChatCollection.updateOne({ id: chatId }, { $push: { chats: message } });
        return addMessage.modifiedCount > 0
    }
}

export default ChatRepository
