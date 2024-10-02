import { ObjectId } from "mongoose";
import { IBloodDonorUpdate, IBloodGroupUpdateTemplate, IEditableGroupGroupRequest } from "../Util/Types/Interface/ModelInterface";
import BloodDonorUpdate from "../db/model/updateBloodGroup";
import BloodGroupUpdate from "../db/model/updateBloodGroup";
import { BloodGroupUpdateStatus } from "../Util/Types/Enum";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";


interface IBloodGroupUpdateRepo {
    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null>
    findRequestById(id: ObjectId): Promise<IBloodDonorUpdate | null>
    updateRequest(update_id: ObjectId, data: IEditableGroupGroupRequest): Promise<boolean>
    findAllRequest(status: BloodGroupUpdateStatus, skip: number, limit: number, perPage: number): Promise<IPaginatedResponse<IBloodDonorUpdate>>
}

class BloodGroupUpdateRepo implements IBloodGroupUpdateRepo {

    private readonly bloodGroupUpdate: typeof BloodGroupUpdate

    constructor() {
        this.bloodGroupUpdate = BloodGroupUpdate;
    }

    async updateRequest(update_id: ObjectId, data: IEditableGroupGroupRequest): Promise<boolean> {
        const update = await this.bloodGroupUpdate.updateOne({ _id: update_id }, { $set: data });
        return update.modifiedCount > 0
    }

    async findRequestById(id: ObjectId): Promise<IBloodDonorUpdate | null> {
        const findRequest: IBloodDonorUpdate | null = await this.bloodGroupUpdate.findById(id);
        return findRequest
    }

    async saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null> {
        const saveData = await new this.bloodGroupUpdate(data).save();
        return saveData?.id
    }

    async findAllRequest(status: BloodGroupUpdateStatus, skip: number, limit: number): Promise<IPaginatedResponse<IBloodDonorUpdate>> {
        try {

            const match: Record<string, any> = {};
            if (status) {
                match['status'] = status
            }


            console.log("The status")
            console.log(status)

            console.log("Page")
            console.log(skip)

            console.log("Limit")
            console.log(limit)

            const findDonation = await this.bloodGroupUpdate.aggregate([
                {
                    $match: match
                },
                {
                    $facet: {
                        paginated: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            },
                            {
                                $lookup: {
                                    from: "donors",
                                    localField: "donor_id",
                                    foreignField: "donor_id",
                                    as: "donor"
                                }
                            },
                            {
                                $unwind: "$donor"
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


            console.log("response");
            console.log(findDonation);


            const response: IPaginatedResponse<IBloodDonorUpdate> = {
                paginated: findDonation[0].paginated,
                total_records: findDonation[0].total_records
            }
            return response;
        } catch (e) {
            console.log(e);

            const response: IPaginatedResponse<IBloodDonorUpdate[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }

}

export default BloodGroupUpdateRepo