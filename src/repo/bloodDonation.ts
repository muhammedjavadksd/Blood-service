import { ObjectId } from "mongoose";
import { IBloodDonate, IBloodDonateTemplate, IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import DonateBlood from "../db/model/donateBlood";
import { BloodDonationStatus } from "../Util/Types/Enum";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";


interface IBloodDonationRepo {
    saveDonation(data: IBloodDonateTemplate): Promise<ObjectId | null>
    findDonationById(id: ObjectId): Promise<IBloodDonate | null>
    updateStatus(id: ObjectId, newStatus: BloodDonationStatus): Promise<boolean>
    findMyDonation(donor_id: string, skip: number, limit: number): Promise<IPaginatedResponse<IBloodDonate[]>>
}

class BloodDonationRepo implements IBloodDonationRepo {

    private readonly BloodDonation;

    constructor() {
        this.BloodDonation = DonateBlood
    }

    async findMyDonation(donor_id: string, skip: number, limit: number): Promise<IPaginatedResponse<IBloodDonate[]>> {

        try {
            const findDonation = await this.BloodDonation.aggregate([
                {
                    $match: {
                        donor_id,
                        status: BloodDonationStatus.Approved
                    }
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])
            const response: IPaginatedResponse<IBloodDonate[]> = {
                paginated: findDonation[0].paginated,
                total_records: findDonation[0].total_records
            }
            return response;
        } catch (e) {
            const response: IPaginatedResponse<IBloodDonate[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }

    }

    async updateStatus(id: ObjectId, newStatus: BloodDonationStatus): Promise<boolean> {
        const findUpdate = await this.BloodDonation.findOneAndUpdate({ _id: id }, { status: newStatus });
        return !!findUpdate?.isModified()
    }

    async findDonationById(id: ObjectId): Promise<IBloodDonate | null> {
        const find = await this.BloodDonation.findById(id);
        return find
    }

    async findMyIntrest(donor_id: string, skip: number, limit: number): Promise<IPaginatedResponse<IBloodDonate[]>> {
        console.log(donor_id);

        try {
            const find = await this.BloodDonation.aggregate([
                {
                    $match: {
                        donor_id
                    }
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip,
                            },
                            {
                                $limit: limit
                            }
                        ],
                        total_records: [
                            {
                                $count: "total_records"
                            }
                        ]
                    }
                },
                {
                    $unwind: "$total_records"
                },
                {
                    $project: {
                        paginated: 1,
                        total_records: "$total_records.total_records"
                    }
                }
            ])
            const response: IPaginatedResponse<IBloodDonate[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }
            return response;
        } catch (e) {
            const response: IPaginatedResponse<IBloodDonate[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
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