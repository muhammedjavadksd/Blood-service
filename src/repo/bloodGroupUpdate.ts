import { ObjectId } from "mongoose";
import { IBloodGroupUpdateTemplate } from "../Util/Types/Interface/ModelInterface";
import BloodDonorUpdate from "../db/model/updateBloodGroup";


interface IBloodGroupUpdateRepo {

    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null>
}

class BloodGroupUpdateRepo implements IBloodGroupUpdateRepo {

    private readonly bloodGroupUpdate: typeof BloodDonorUpdate

    constructor() {
        this.bloodGroupUpdate = BloodDonorUpdate;
    }

    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null> {
        const saveData = new this.bloodGroupUpdate(data);
        return saveData?.id
    }

}

export default BloodGroupUpdateRepo