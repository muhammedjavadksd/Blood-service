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

    async findMyIntrest(donor_id: string): Promise<IBloodDonate[]> {
        console.log(donor_id);

        const find = await this.BloodDonation.aggregate([
            {
                $match: {
                    donor_id
                }
            },
            {
                $lookup: {
                    from: "chats",
                    foreignField: "requirement_id",
                    localField: "donation_id",
                    as: "chats_count",
                    pipeline: [{
                        $match: {
                            'chats.seen': false
                        }
                    }]
                }
            },
            {
                $lookup: {
                    from: "blood_requirements",
                    foreignField: "blood_id",
                    localField: "donation_id",
                    as: "requirement",
                }
            },
            {
                $addFields: {
                    "message_count": { $size: "$chats_count" },
                    "requirement": { $arrayElemAt: ['$requirement', 0] }
                }
            },
            {
                $project: {
                    chats_count: 0
                }
            }
        ])
        console.log("Find data");

        console.log(find);

        return find
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