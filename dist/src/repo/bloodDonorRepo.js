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
    blockDonor(donor_id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockedDate = new Date();
            const updateData = yield this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: Enum_1.BloodDonorStatus.Blocked, blocked_date: blockedDate } });
            return updateData.modifiedCount > 0;
        });
    }
    unBlockDonor(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = yield this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: Enum_1.BloodDonorStatus.Open } });
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
            try {
                const findDonors = yield this.BloodDonor.aggregate([
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
    nearBySearch(location, limit, skip, group) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("The location");
                console.log(location);
                const find = yield this.BloodDonor.aggregate([
                    {
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: location
                            },
                            distanceField: "distance", // Adds the distance from the point
                            spherical: true, // Use spherical distance calculation
                            maxDistance: 5000000000000, // Optional: Maximum distance in meters (e.g., 5 km)
                        },
                    },
                    {
                        $match: {
                            status: Enum_1.BloodDonorStatus.Open,
                            blood_group: group
                        }
                    },
                    {
                        $facet: {
                            paginated: [
                                { $skip: skip }, // Skip based on pagination offset
                                { $limit: limit }, // Limit number of documents
                                {
                                    $sort: { distance: 1 } // Sort by distance, ascending order
                                }
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
                console.log(find);
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
