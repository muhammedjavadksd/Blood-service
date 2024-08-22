import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";

interface IChatService {
    startChat(requirement_id: string, donor_id: string, intrest_id: string): Promise<HelperFunctionResponse>
}

class ChatService implements IChatService {

    startChat(requirement_id: string, donor_id: string, intrest_id: string): Promise<HelperFunctionResponse> {

    }
}

export default ChatService;