import axios from "axios"

interface IProfileChat {
    createChatRoom(msg: string, to_profile: string, token: string): void
}

class ProfileChat implements IProfileChat {

    createChatRoom(msg: string, to_profile: string, token: string): void {
        axios.post(
            `${process.env.PROFILE_END_POINT || ""}/create_chat/profile_id`,
            { to_profile: to_profile, msg },
            { headers: { authorization: `Bearer ${token}` } }
        ).then(() => true).catch((e) => {
            console.log(e);
            return false;
        });
    }
}

export default ProfileChat