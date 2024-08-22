import { ObjectId } from "mongoose";
import ChatRepository from "../repo/chatRepo";
import { ChatFrom, StatusCode } from "../Util/Types/Enum";
import { IChatTemplate } from "../Util/Types/Interface/ModelInterface";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import BloodReqDepo from "../repo/bloodReqRepo";
import BloodDonationRepo from "../repo/bloodDonation";
import BloodDonorRepo from "../repo/bloodDonorRepo";

interface IChatService {
    startChat(from_profile_id: string, to_profile_id: string, requirement_id: string, msg: string, started: ChatFrom, donor_id: string, intrest_id: ObjectId): Promise<HelperFunctionResponse>
    getMyChats(profile_id: string): Promise<HelperFunctionResponse>
}

class ChatService implements IChatService {

    chatRepo;
    reqRepo;
    donationRepo;
    donorRepo;

    constructor() {
        this.chatRepo = new ChatRepository();
        this.reqRepo = new BloodReqDepo()
        this.donationRepo = new BloodDonationRepo()
        this.donorRepo = new BloodDonorRepo()
    }


    async getMyChats(profile_id: string): Promise<HelperFunctionResponse> {
        const findMyChats = await this.chatRepo.findChatMyChat(profile_id);
        if (findMyChats.length) {
            return {
                statusCode: StatusCode.OK,
                status: true,
                msg: "Chat fetched",
                data: {
                    chats: findMyChats
                }
            }
        } else {
            return {
                statusCode: StatusCode.BAD_REQUEST,
                status: false,
                msg: "No chat found",
            }
        }

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