"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const donors_1 = __importDefault(require("../db/model/donors"));
const Enum_1 = require("../Util/Types/Enum");
const moment_1 = __importDefault(require("moment"));
class BloodDonorRepo {
    constructor() {
        this.createDonor = this.createDonor.bind(this);
        this.findBloodDonorByDonorId = this.findBloodDonorByDonorId.bind(this);
        this.updateBloodDonor = this.updateBloodDonor.bind(this);
        this.findDonors = this.findDonors.bind(this);
        this.blockDonor = this.blockDonor.bind(this);
        this.unBlockDonor = this.unBlockDonor.bind(this);
        this.BloodDonor = donors_1.default;
    }
    bulkUnBlock(donor_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const unblock = yield this.BloodDonor.updateMany({ donor_id: { $in: donor_ids } }, {
                $set: {
                    status: Enum_1.BloodDonorStatus.Open,
                    blocked_date: null,
                    blocked_reason: null
                }
            });
            return unblock.modifiedCount > 0;
        });
    }
    findBlockedSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlockedAccount = yield this.BloodDonor.find({
                status: Enum_1.BloodDonorStatus.Blocked,
                blocked_date: {
                    $lt: (0, moment_1.default)().subtract(90, 'days').toDate(),
                },
                blocked_reason: Enum_1.DonorAccountBlockedReason.AlreadyDonated
            })
                .select({ donor_id: 1, _id: 0 })
                .exec();
            return findBlockedAccount.map(account => account.donor_id);
        });
    }
    getStatitics() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const result = yield this.BloodDonor.aggregate([
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
                                        $sum: { $cond: [{ $eq: ["$status", Enum_1.BloodDonorStatus.Open] }, 1, 0] }
                                    },
                                    inactiveCount: {
                                        $sum: { $cond: [{ $ne: ["$status", Enum_1.BloodDonorStatus.Open] }, 1, 0] }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]);
            return {
                totalDonors: ((_a = result[0].totalDonors[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                openDonors: ((_b = result[0].openDonors[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                closedDonors: ((_c = result[0].closedDonors[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
                donorsByBloodGroup: result[0].donorsByBloodGroup
            };
        });
    }
    blockDonor(donor_id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockedDate = new Date();
            const updateData = yield this.BloodDonor.updateOne({ donor_id: donor_id }, {
                $set: {
                    status: Enum_1.BloodDonorStatus.Blocked,
                    blocked_date: blockedDate,
                    blocked_reason: reason,
                }
            });
            return updateData.modifiedCount > 0;
        });
    }
    unBlockDonor(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = yield this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: Enum_1.BloodDonorStatus.Open } });
            return updateData.modifiedCount > 0;
        });
    }
    updateBloodGroup(donor_id, bloodGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = yield this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { blood_group: bloodGroup } });
            return updateData.modifiedCount > 0;
        });
    }
    findDonors(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const findDonors = yield this.BloodDonor.find(filter);
            return findDonors;
        });
    }
    findDonorsPaginated(limit, skip, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filter);
            try {
                const findDonors = yield this.BloodDonor.aggregate([
                    {
                        $match: filter
                    },
                    {
                        $facet: {
                            paginated: [
                                {
                                    $sort: {
                                        _id: -1
                                    }
                                },
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
                const response = {
                    paginated: findDonors[0].paginated,
                    total_records: findDonors[0].total_records
                };
                return response;
            }
            catch (e) {
                return {
                    paginated: [],
                    total_records: 0
                };
            }
        });
    }
    updateBloodDonor(editData, edit_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Edit data");
            console.log(editData);
            const updateData = yield this.BloodDonor.updateOne({ donor_id: edit_id }, { $set: editData });
            console.log(editData, edit_id);
            console.log(updateData);
            return updateData.modifiedCount > 0;
        });
    }
    findBloodDonorByDonorId(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findDonor = yield this.BloodDonor.findOne({ donor_id });
            return findDonor;
        });
    }
    createDonor(donorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertDonor = new this.BloodDonor(donorData);
            const save = yield insertDonor.save();
            return save === null || save === void 0 ? void 0 : save.id;
        });
    }
    nearBySearch(activeOnly, location, limit, skip, group) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = {};
                if (group) {
                    match['blood_group'] = group;
                }
                if (activeOnly) {
                    match['status'] = Enum_1.BloodDonorStatus.Open;
                }
                console.log("Match query");
                console.log(match);
                const find = yield this.BloodDonor.aggregate([
                    {
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: location
                            },
                            distanceField: "distance_km",
                            spherical: true,
                            maxDistance: 50000000,
                            // key: "location_coords",
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
                                { $skip: skip }, // Skip based on pagination offset
                                { $limit: limit }, // Limit number of documents
                            ],
                            total_records: [
                                { $count: "total_records" } // Count total number of records
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
                const response = {
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
                };
                return response;
            }
            catch (e) {
                console.log(e);
                const response = {
                    paginated: [],
                    total_records: 0
                };
                return response;
            }
        });
    }
}
exports.default = BloodDonorRepo;
