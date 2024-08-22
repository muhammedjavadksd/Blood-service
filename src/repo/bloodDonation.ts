import { ObjectId } from "mongoose";
import { IBloodDonate, IBloodDonateTemplate, IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import DonateBlood from "../db/model/donateBlood";


interface IBloodDonationRepo {
    saveDonation(data: IBloodDonateTemplate): Promise<ObjectId | null>
}

class BloodDonationRepo implements IBloodDonationRepo {

    private readonly BloodDonation;

    constructor() {
        this.BloodDonation = DonateBlood
    }


    async findExistanceOfDonation(donor_id: string, case_id: string): Promise<IBloodDonate | null> {
        const find = await this.BloodDonation.findOne({ donor_id, donation_id: case_id })
        return find
    }

    async saveDonation(data: IBloodDonateTemplate): Promise<ObjectId | null> {
        console.log(data);

        const saveData = await new this.BloodDonation(data).save();
        return saveData.id
    }

}

export default BloodDonationRepo