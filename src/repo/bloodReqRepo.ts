import BloodRequirement from "../db/model/requirements";
import { BloodGroup, BloodStatus, ExtendsRelationship, Relationship } from "../Util/Types/Enum";
import IBloodRequirement, { IEditableBloodRequirementTemplate } from "../Util/Types/Interface/ModelInterface";
import { IPaginatedResponse } from "../Util/Types/Interface/UtilInterface";
import { LocatedAt, mongoObjectId } from "../Util/Types/Types";


interface IBloodReqDepo {
    getStatitics(): Promise<Record<string, any>>
    createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number, is_closed: boolean, email_address: string): Promise<mongoObjectId | null>
    findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null>
    updateBloodDonor(blood_id: string, data: IEditableBloodRequirementTemplate): Promise<boolean>
    findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]>
    findActiveBloodReqPaginted(limit: number, skip: number, status: BloodStatus, match: Record<string, any>): Promise<IBloodRequirement[]>
    findBloodReqPaginted(limit: number, skip: number): Promise<IPaginatedResponse<IBloodRequirement[]>>
    addIntrest(donor_id: string, blood_id: string): Promise<boolean>
    findMyIntrest(donor_id: string): Promise<IBloodRequirement[]>
    findUserRequirement(profile_id: string, skip: number, limit: number, status: BloodStatus): Promise<IPaginatedResponse<IBloodRequirement[]>>
    advanceFilter(search: Record<string, any>, limit: number, skip: number): Promise<IPaginatedResponse<IBloodRequirement[]>>
    updateBloodRequirement(blood_id: string, status: BloodStatus): Promise<boolean>
    findSingleBloodRequirement(blood_id: string, status: BloodStatus): Promise<IBloodRequirement | null>
}

class BloodReqDepo implements IBloodReqDepo {


    private readonly BloodReq: typeof BloodRequirement

    constructor() {
        this.BloodReq = BloodRequirement
    }

    async getStatitics(): Promise<Record<string, any>> {
        const result = await this.BloodReq.aggregate([
            {
                $facet: {
                    totalRequests: [{ $count: "count" }],
                    openRequests: [
                        { $match: { is_closed: false } },
                        { $count: "count" }
                    ],
                    closedRequests: [
                        { $match: { is_closed: true } },
                        { $count: "count" }
                    ],
                    totalUnitsNeeded: [
                        {
                            $group: {
                                _id: null,
                                totalUnits: { $sum: "$unit" }
                            }
                        }
                    ],
                    requestsByBloodGroup: [
                        {
                            $group: {
                                _id: "$blood_group",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    requestsByStatus: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);
        return {
            totalRequests: result[0].totalRequests[0]?.count || 0,
            openRequests: result[0].openRequests[0]?.count || 0,
            closedRequests: result[0].closedRequests[0]?.count || 0,
            totalUnitsNeeded: result[0].totalUnitsNeeded[0]?.totalUnits || 0,
            requestsByBloodGroup: result[0].requestsByBloodGroup,
            requestsByStatus: result[0].requestsByStatus
        };

    }

    async findSingleBloodRequirement(blood_id: string, status?: BloodStatus): Promise<IBloodRequirement | null> {
        const query: Record<string, any> = { blood_id };

        if (status) {
            query.status = status;
        }

        const find = await this.BloodReq.findOne(query);
        return find
    }


    async updateBloodRequirement(blood_id: string, status: BloodStatus): Promise<boolean> {
        const update = await this.BloodReq.updateOne({ blood_id }, { $set: { status } })
        return update.modifiedCount > 0
    }


    async advanceFilter(search: Record<string, any>, limit: number, skip: number): Promise<IPaginatedResponse<IBloodRequirement[]>> {

        try {
            const findDonation = await this.BloodReq.aggregate([
                {
                    $match: search
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

            const response: IPaginatedResponse<IBloodRequirement[]> = {
                paginated: findDonation[0].paginated,
                total_records: findDonation[0].total_records
            }
            return response;
        } catch (e) {
            const response: IPaginatedResponse<IBloodRequirement[]> = {
                paginated: [],
                total_records: 0
            }
            return response;
        }
    }


    async findUserRequirement(profile_id: string, skip: number, limit: number, status?: BloodStatus): Promise<IPaginatedResponse<IBloodRequirement[]>> {


        try {

            const matchFilter: Record<string, any> = {
                profile_id,
            }
            if (status) {
                matchFilter['status'] = status
            }

            console.log(matchFilter);


            const findReq = await this.BloodReq.aggregate([
                {
                    $match: matchFilter
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
                },
                {
                    $lookup: {
                        from: "donate_bloods",
                        foreignField: "donation_id",
                        localField: "blood_id",
                        as: "intrest_submission"
                    }
                }
            ]);


            console.log('Requirement found');
            console.log(findReq);


            const response: IPaginatedResponse<IBloodRequirement[]> = {
                paginated: findReq[0].paginated,
                total_records: findReq[0].total_records
            }
            return response
        } catch (e) {
            console.log(e);
            return {
                paginated: [],
                total_records: 0
            }
        }
    }


    async findMyIntrest(donor_id: string): Promise<IBloodRequirement[]> {
        const findMyIntrest = await this.BloodReq.find({ shows_intrest_donors: donor_id });
        return findMyIntrest
    }




    async addIntrest(donor_id: string, blood_id: string): Promise<boolean> {
        const addIntrest = await this.BloodReq.updateOne({ blood_id }, { $addToSet: { shows_intrest_donors: donor_id } })
        return !!addIntrest.modifiedCount
    }




    async findBloodReqPaginted(limit: number, skip: number, status?: BloodStatus, matchs?: Record<string, any>): Promise<IPaginatedResponse<IBloodRequirement[]>> {

        const match: Record<string, any> = {}
        if (status) {
            match['status'] = status
        }

        console.log(match);
        console.log(matchs);

        try {
            const bloodGroup = await this.BloodReq.aggregate([
                {
                    $match: { ...match, ...matchs }
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

            console.log(bloodGroup);


            const response: IPaginatedResponse<IBloodRequirement[]> = {
                paginated: bloodGroup[0].paginated,
                total_records: bloodGroup[0].total_records
            }
            return response;
        } catch (e) {
            console.log(e);
            return {
                paginated: [],
                total_records: 0
            }
        }
    }

    async findActiveBloodReqPaginted(limit: number, skip: number): Promise<IBloodRequirement[]> {
        console.log(limit, skip);

        const bloodGroup: IBloodRequirement[] = await this.BloodReq.find({ status: BloodStatus.Approved, is_closed: false }).skip(skip).limit(limit)
        return bloodGroup
    }

    async findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]> {
        const bloodGroup: IBloodRequirement[] = await this.BloodReq.find({ blood_group, status: BloodStatus.Pending })
        return bloodGroup
    }


    async findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null> {
        const find: IBloodRequirement | null = await this.BloodReq.findOne({ blood_id });
        return find
    }

    async createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: ExtendsRelationship, locatedAt: LocatedAt, address: string, phoneNumber: number, is_closed: boolean, email_address: string): Promise<mongoObjectId | null> {
        console.log('blood_id:', blood_id);
        console.log('patientName:', patientName);
        console.log('unit:', unit);
        console.log('neededAt:', neededAt);
        console.log('status:', status);
        console.log('user_id:', user_id);
        console.log('profile_id:', profile_id);
        console.log('blood_group:', blood_group);
        console.log('relationship:', relationship);
        console.log('locatedAt:', locatedAt);
        console.log('address:', address);
        console.log('phoneNumber:', phoneNumber);
        console.log('is_closed:', is_closed);
        try {
            const bloodRequirement = new this.BloodReq({ blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, is_closed, email_id: email_address });
            const userCreated = await bloodRequirement.save();
            return userCreated.id
        } catch (e) {
            console.log(e);

            return null
        }
    }

    async updateBloodDonor(blood_id: string, data: IEditableBloodRequirementTemplate): Promise<boolean> {
        const updateData = await this.BloodReq.updateOne({ blood_id: blood_id }, { $set: data })
        if (updateData.matchedCount > 0) {
            return true
        } else {
            return false
        }
    }
}

export default BloodReqDepo