import { ObjectId } from "mongoose";
import { IBloodDonor, IBloodDonorTemplate, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorCollection from "../db/model/donors";
import { BloodDonorStatus, BloodGroup, BloodStatus, DonorAccountBlockedReason } from "../Util/Types/Enum";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";

interface IBloodDonorRepo {
    getStatitics(): Promise<Record<string, any>>
    createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId>
    findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null>
    updateBloodDonor(editData: IUserBloodDonorEditable, edit_id: string): Promise<boolean>
    findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]>
    blockDonor(donor_id: string, reason: DonorAccountBlockedReason): Promise<boolean>
    unBlockDonor(donor_id: string): Promise<boolean>
    nearBySearch(activeOnly: boolean, location: [number, number], limit: number, skip: number, group: BloodGroup): Promise<IPaginatedResponse<IBloodDonor[]>>
    findDonorsPaginated(limit: number, skip: number, filter: ISearchBloodDonorTemplate): Promise<IPaginatedResponse<IBloodDonor[]>>
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


    async getStatitics(): Promise<Record<string, any>> {
        const result = await this.BloodDonor.aggregate([
            {
                $facet: {
                    totalDonors: [{ $count: "count" }],
                    openDonors: [
                        { $match: { status: "Open" } },
                        { $count: "count" }
                    ],
                    closedDonors: [
                        { $match: { status: "Closed" } },
                        { $count: "count" }
                    ],
                    donorsByBloodGroup: [
                        {
                            $group: {
                                _id: "$blood_group",
                                activeCount: {
                                    $sum: { $cond: [{ $eq: ["$status", BloodDonorStatus.Open] }, 1, 0] }
                                },
                                inactiveCount: {
                                    $sum: { $cond: [{ $ne: ["$status", BloodDonorStatus.Open] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        return {
            totalDonors: result[0].totalDonors[0]?.count || 0,
            openDonors: result[0].openDonors[0]?.count || 0,
            closedDonors: result[0].closedDonors[0]?.count || 0,
            donorsByBloodGroup: result[0].donorsByBloodGroup
        };
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

    async updateBloodGroup(donor_id: string, bloodGroup: BloodGroup): Promise<boolean> {
        const updateData = await this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { blood_group: bloodGroup } })
        return updateData.modifiedCount > 0
    }

    async findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]> {
        const findDonors = await this.BloodDonor.find(filter);
        return findDonors;
    }

    async findDonorsPaginated(limit: number, skip: number, filter: ISearchBloodDonorTemplate): Promise<IPaginatedResponse<IBloodDonor[]>> {

        console.log(filter);

        try {

            const findDonors = await this.BloodDonor.aggregate([
                {
                    $match: filter
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
            ]);

            const response: IPaginatedResponse<IBloodDonor[]> = {
                paginated: findDonors[0].paginated,
                total_records: findDonors[0].total_records
            }
            return response;
        } catch (e) {
            return {
                paginated: [],
                total_records: 0
            }
        }
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


    async nearBySearch(activeOnly: boolean, location: [number, number], limit: number, skip: number, group: BloodGroup | null): Promise<IPaginatedResponse<IBloodDonor[]>> {
        try {

            const match: Record<string, any> = {};

            if (group) {
                match['blood_group'] = group
            }

            if (activeOnly) {
                match['status'] = BloodDonorStatus.Open
            }

            const find = await this.BloodDonor.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: location
                        },
                        distanceField: "distance_km",
                        spherical: true,
                        maxDistance: 50000000,
                    },
                },
                {
                    $match: match
                },
                {
                    $addFields: {
                        "distance": {
                            $concat: [
                                {
                                    $toString: {
                                        $ceil: { $divide: ['$distance_km', 1000] }
                                    }
                                },
                                " Km"
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        distance_km: -1
                    }
                },
                {
                    $facet: {
                        paginated: [
                            { $skip: skip },   // Skip based on pagination offset
                            { $limit: limit }, // Limit number of documents
                            {
                                $sort: { distance: 1 }  // Sort by distance, ascending order
                            }
                        ],
                        total_records: [
                            { $count: "total_records" }  // Count total number of records
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
            ]);
            console.log(find[0].paginated);

            const response: IPaginatedResponse<IBloodDonor[]> = {
                paginated: find[0].paginated,
                total_records: find[0].total_records
            }
            return response;
        } catch (e) {
            console.log(e);

            const response: IPaginatedResponse<IBloodDonor[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }

}

export default BloodDonorRepo