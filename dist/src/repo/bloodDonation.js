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
const donateBlood_1 = __importDefault(require("../db/model/donateBlood"));
const Enum_1 = require("../Util/Types/Enum");
class BloodDonationRepo {
    constructor() {
        this.BloodDonation = donateBlood_1.default;
    }
    findByCertificateId(certificate_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = this.BloodDonation.findOne({ certificate: certificate_id });
            return find;
        });
    }
    findMyDonation(donor_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(donor_id);
            try {
                const findDonation = yield this.BloodDonation.aggregate([
                    {
                        $match: {
                            donor_id,
                            status: Enum_1.BloodDonationStatus.Approved
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
                                    $lookup: {
                                        as: "donor_profile",
                                        foreignField: "donor_id",
                                        localField: "donor_id",
                                        from: "donors"
                                    }
                                },
                                {
                                    $unwind: "$requirement"
                                },
                                {
                                    $unwind: "$donor_profile"
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
    updateStatus(id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUpdate = yield this.BloodDonation.updateOne({ _id: id }, { $set: { status: newStatus } });
            console.log(findUpdate);
            return (findUpdate === null || findUpdate === void 0 ? void 0 : findUpdate.modifiedCount) > 0;
        });
    }
    updateUnit(id, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUpdate = yield this.BloodDonation.updateOne({ _id: id }, { $set: { unit } });
            console.log(findUpdate);
            return (findUpdate === null || findUpdate === void 0 ? void 0 : findUpdate.modifiedCount) > 0;
        });
    }
    findDonationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.BloodDonation.findById(id);
            return find;
        });
    }
    findBloodResponse(blood_id, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = {
                    donation_id: blood_id
                };
                if (status) {
                    match['status'] = status;
                }
                const find = yield this.BloodDonation.aggregate([
                    {
                        $match: match
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
                                    $lookup: {
                                        as: "donor_profile",
                                        foreignField: "donor_id",
                                        localField: "donor_id",
                                        from: "donors"
                                    }
                                },
                                {
                                    $unwind: "$requirement"
                                },
                                {
                                    $unwind: "$donor_profile"
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
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
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
    findMyIntrest(donor_id, skip, limit, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(donor_id);
            const filter = {
                donor_id
            };
            if (status) {
                if (status == Enum_1.BloodDonationStatus.Rejected) {
                    filter['$or'] = [
                        {
                            "status": Enum_1.BloodDonationStatus.Rejected
                        },
                        {
                            "status": { "$ne": Enum_1.BloodDonationStatus.Approved },
                            "meet_expect": {
                                "$lte": new Date()
                            }
                        }
                    ];
                }
                else if (status == Enum_1.BloodDonationStatus.Pending) {
                    filter['$or'] = [
                        {
                            "status": Enum_1.BloodDonationStatus.Pending,
                            "meet_expect": {
                                "$gte": new Date()
                            }
                        },
                    ];
                }
                else {
                    filter['status'] = status;
                }
            }
            console.log("Filter is");
            console.log(filter);
            try {
                const find = yield this.BloodDonation.aggregate([
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
                ]);
                const response = {
                    paginated: find[0].paginated,
                    total_records: find[0].total_records
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
    findExistanceOfDonation(donor_id, case_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.BloodDonation.findOne({ donor_id, donation_id: case_id });
            return find;
        });
    }
    updateCertificate(donation_id, certificate, certificate_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.BloodDonation.updateOne({ _id: donation_id }, {
                $set: {
                    certificate,
                    certificate_id,
                }
            });
            return find.modifiedCount > 0;
        });
    }
    saveDonation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const saveData = yield new this.BloodDonation(data).save();
            return saveData.id;
        });
    }
}
exports.default = BloodDonationRepo;
