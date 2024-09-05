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
    findMyDonation(donor_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const findUpdate = yield this.BloodDonation.findOneAndUpdate({ _id: id }, { status: newStatus });
            return !!(findUpdate === null || findUpdate === void 0 ? void 0 : findUpdate.isModified());
        });
    }
    findDonationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.BloodDonation.findById(id);
            return find;
        });
    }
    findMyIntrest(donor_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(donor_id);
            try {
                const find = yield this.BloodDonation.aggregate([
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
    saveDonation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const saveData = yield new this.BloodDonation(data).save();
            return saveData.id;
        });
    }
}
exports.default = BloodDonationRepo;
