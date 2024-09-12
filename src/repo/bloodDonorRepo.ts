import { ObjectId } from "mongoose";
import { IBloodDonor, IBloodDonorTemplate, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorCollection from "../db/model/donors";
import { BloodDonorStatus, DonorAccountBlockedReason } from "../Util/Types/Enum";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";

interface IBloodDonorRepo {
    createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId>
    findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null>
    updateBloodDonor(editData: IUserBloodDonorEditable, edit_id: string): Promise<boolean>
    findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]>
    blockDonor(donor_id: string, reason: DonorAccountBlockedReason): Promise<boolean>
    unBlockDonor(donor_id: string): Promise<boolean>
    nearBySearch(location: [number, number], limit: number, skip: number): Promise<IPaginatedResponse<IBloodDonor[]>>
}

class BloodDonorRepo implements IBloodDonorRepo {

    private readonly BloodDonor: typeof BloodDonorCollection

    constructor() {
        this.createDonor = this.createDonor.bind(this)
        this.findBloodDonorByDonorId = this.findBloodDonorByDonorId.bind(this)
        this.updateBloodDonor = this.updateBloodDonor.bind(this)
        this.findDonors = this.findDonors.bind(this)
        this.blockDonor = this.blockDonor.bind(this)
        this.unBlockDonor = this.unBlockDonor.bind(this)
        this.BloodDonor = BloodDonorCollection;
    }

    async blockDonor(donor_id: string, reason: DonorAccountBlockedReason): Promise<boolean> {
        const blockedDate = new Date()
        const updateData = await this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: BloodDonorStatus.Blocked, blocked_date: blockedDate } })
        return updateData.modifiedCount > 0
    }

    async unBlockDonor(donor_id: string): Promise<boolean> {
        const updateData = await this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: BloodDonorStatus.Open } })
        return updateData.modifiedCount > 0
    }

    async findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]> {
        const findDonors = await this.BloodDonor.find(filter);
        return findDonors;
    }

    async updateBloodDonor(editData: IUserBloodDonorEditable, edit_id: string): Promise<boolean> {

        const updateData = await this.BloodDonor.updateOne({ donor_id: edit_id }, { $set: editData })
        console.log(editData, edit_id);
        console.log(updateData);
        return updateData.modifiedCount > 0
    }

    async findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null> {
        const findDonor: IBloodDonor | null = await this.BloodDonor.findOne({ donor_id });
        return findDonor
    }

    async createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId> {
        const insertDonor = new this.BloodDonor(donorData);
        const save = await insertDonor.save();
        return save?.id
    }


    async nearBySearch(location: [number, number], limit: number, skip: number): Promise<IPaginatedResponse<IBloodDonor[]>> {
        try {
            const find = await this.BloodDonor.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: location
                        },
                        distanceField: "distance",  // Adds the distance from the point
                        spherical: true,            // Use spherical distance calculation
                        maxDistance: 5000,          // Optional: Maximum distance in meters (e.g., 5 km)
                    }
                },
                {
                    $facet: {
                        paginated: [
                            { $skip: skip },   // Skip based on pagination offset
                            { $limit: limit }  // Limit number of documents
                        ],
                        total_records: [
                            { $count: "total_records" }  // Count total number of records
                        ]
                    }
                }
            ]);
            const response: IPaginatedResponse<IBloodDonor[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }
            return response;
        } catch (e) {
            const response: IPaginatedResponse<IBloodDonor[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }

}

export default BloodDonorRepo