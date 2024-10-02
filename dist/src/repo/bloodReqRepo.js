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
const requirements_1 = __importDefault(require("../db/model/requirements"));
const Enum_1 = require("../Util/Types/Enum");
class BloodReqDepo {
    constructor() {
        this.BloodReq = requirements_1.default;
    }
    getStatitics() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const result = yield this.BloodReq.aggregate([
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
                totalRequests: ((_a = result[0].totalRequests[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                openRequests: ((_b = result[0].openRequests[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                closedRequests: ((_c = result[0].closedRequests[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
                totalUnitsNeeded: ((_d = result[0].totalUnitsNeeded[0]) === null || _d === void 0 ? void 0 : _d.totalUnits) || 0,
                requestsByBloodGroup: result[0].requestsByBloodGroup,
                requestsByStatus: result[0].requestsByStatus
            };
        });
    }
    findSingleBloodRequirement(blood_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { blood_id };
            if (status) {
                query.status = status;
            }
            const find = yield this.BloodReq.findOne(query);
            return find;
        });
    }
    updateBloodRequirement(blood_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.BloodReq.updateOne({ blood_id }, { $set: { status } });
            return update.modifiedCount > 0;
        });
    }
    advanceFilter(search, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findDonation = yield this.BloodReq.aggregate([
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
                ]);
                const response = {
                    paginated: findDonation[0].paginated,
                    total_records: findDonation[0].total_records
                };
                return response;
            }
            catch (e) {
                const response = {
                    paginated: [],
                    total_records: 0
                };
                return response;
            }
        });
    }
    findUserRequirement(profile_id, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchFilter = {
                    profile_id,
                };
                if (status) {
                    matchFilter['status'] = status;
                }
                console.log(matchFilter);
                const findReq = yield this.BloodReq.aggregate([
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
                const response = {
                    paginated: findReq[0].paginated,
                    total_records: findReq[0].total_records
                };
                return response;
            }
            catch (e) {
                console.log(e);
                return {
                    paginated: [],
                    total_records: 0
                };
            }
        });
    }
    findMyIntrest(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMyIntrest = yield this.BloodReq.find({ shows_intrest_donors: donor_id });
            return findMyIntrest;
        });
    }
    addIntrest(donor_id, blood_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const addIntrest = yield this.BloodReq.updateOne({ blood_id }, { $addToSet: { shows_intrest_donors: donor_id } });
            return !!addIntrest.modifiedCount;
        });
    }
    findBloodReqPaginted(limit, skip, status, matchs) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = {};
            if (status) {
                match['status'] = status;
            }
            console.log(match);
            console.log(matchs);
            try {
                const bloodGroup = yield this.BloodReq.aggregate([
                    {
                        $match: Object.assign(Object.assign({}, match), matchs)
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
                console.log(bloodGroup);
                const response = {
                    paginated: bloodGroup[0].paginated,
                    total_records: bloodGroup[0].total_records
                };
                return response;
            }
            catch (e) {
                console.log(e);
                return {
                    paginated: [],
                    total_records: 0
                };
            }
        });
    }
    findActiveBloodReqPaginted(limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(limit, skip);
            const bloodGroup = yield this.BloodReq.find({ status: Enum_1.BloodStatus.Approved }).skip(skip).limit(limit);
            return bloodGroup;
        });
    }
    findActiveBloodReq(blood_group) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloodGroup = yield this.BloodReq.find({ blood_group, status: Enum_1.BloodStatus.Pending });
            return bloodGroup;
        });
    }
    findBloodRequirementByBloodId(blood_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.BloodReq.findOne({ blood_id });
            return find;
        });
    }
    createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, is_closed, email_address) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const userCreated = yield bloodRequirement.save();
                return userCreated.id;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    updateBloodDonor(blood_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = yield this.BloodReq.updateOne({ blood_id: blood_id }, { $set: data });
            if (updateData.matchedCount > 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.default = BloodReqDepo;
