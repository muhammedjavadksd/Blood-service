import { ObjectId } from "mongoose";
import { IChatCollection, IChatTemplate, IMessageTemplate } from "../Util/Types/Interface/ModelInterface";
import ChatCollection from "../db/model/chatModel";


interface IChatRepo {
    createChat(chat: IChatTemplate): Promise<ObjectId | null>
    findChatById(id: string): Promise<IChatCollection | null>
    addMessageToChat(chatId: string, message: IMessageTemplate): Promise<boolean>
    findChatMyChat(profile_id: string): Promise<IChatCollection[]>
}


class ChatRepository implements IChatRepo {

    chatCollection;

    constructor() {
        this.chatCollection = ChatCollection;
    }

    async findChatMyChat(profile_id: string): Promise<IChatCollection[]> {
        const myChat = await this.chatCollection.aggregate([
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
        ])
        //     await this.chatCollection.find({
        //     $or: [{
        //         from_profile_id: profile_id
        //     },
        //     {
        //         to_profile_id: profile_id,
        //     }]
        // })
        console.log(myChat);

        return myChat
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
