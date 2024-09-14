import { ObjectId } from "mongoose";
import { IBloodDonate, IBloodDonateTemplate, IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import DonateBlood from "../db/model/donateBlood";
import { BloodDonationStatus } from "../Util/Types/Enum";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";


interface IBloodDonationRepo {
    saveDonation(data: IBloodDonateTemplate): Promise<ObjectId | null>
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

    async findMyIntrest(donor_id: string, skip: number, limit: number, status?: BloodDonationStatus): Promise<IPaginatedResponse<IBloodDonate[]>> {
        console.log(donor_id);

        const filter: Record<string, any> = {
            donor_id
        }
        if (status) {
            if (status == BloodDonationStatus.Rejected) {
                filter['$or'] = [
                    {
                        "status": BloodDonationStatus.Rejected
                    },
                    {
                        "status": { "$ne": BloodDonationStatus.Approved },
                        "meet_expect": {
                            "$lte": new Date()
                        }
                    }
                ]
            } else if (status == BloodDonationStatus.Pending) {
                filter['$or'] = [
                    {
                        "status": BloodDonationStatus.Pending,
                        "meet_expect": {
                            "$gte": new Date()
                        }
                    },
                ]
            } else {
                filter['status'] = status
            }
        }

        console.log("Filter is");
        console.log(filter);


        try {
            const find = await this.BloodDonation.aggregate([
                {
                    $match: filter
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip,
                            },
                            {
                                $limit: limit
                            },
                            {
                                $lookup: {
                                    as: "requirement",
                                    foreignField: "blood_id",
                                    localField: "donation_id",
                                    from: "blood_requirements"
                                }
                            },
                            {
                                $unwind: "$requirement"
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