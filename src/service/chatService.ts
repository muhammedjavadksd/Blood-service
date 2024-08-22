import { ObjectId } from "mongoose";
import ChatRepository from "../repo/chatRepo";
import { ChatFrom, StatusCode } from "../Util/Types/Enum";
import { IChatTemplate } from "../Util/Types/Interface/ModelInterface";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";

interface IChatService {
    startChat(from_profile_id: string, to_profile_id: string, requirement_id: string, msg: string, started: ChatFrom, donor_id: string, intrest_id: ObjectId): Promise<HelperFunctionResponse>
}

class ChatService implements IChatService {

    chatRepo;

    constructor() {
        this.chatRepo = new ChatRepository();
    }

    async startChat(from_profile_id: string, to_profile_id: string, requirement_id: string, msg: string, started: ChatFrom, donor_id: string, intrest_id: ObjectId): Promise<HelperFunctionResponse> {


        console.log("To provide id is");
        console.log(to_profile_id);


        const chat: IChatTemplate = {
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
        }
        console.log(chat);

        const saveChat = await this.chatRepo.createChat(chat)
        if (saveChat) {
            return {
                status: true,
                msg: "Chat created success",
                statusCode: StatusCode.CREATED,
                data: {
                    chat_id: saveChat
                }
            }
        } else {
            return {
                status: false,
                msg: "Chat created failed",
                statusCode: StatusCode.BAD_REQUEST,
            }
        }
    }
}

export default ChatService;