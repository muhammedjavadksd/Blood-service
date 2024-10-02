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
const updateBloodGroup_1 = __importDefault(require("../db/model/updateBloodGroup"));
class BloodGroupUpdateRepo {
    constructor() {
        this.bloodGroupUpdate = updateBloodGroup_1.default;
    }
    updateRequest(update_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.bloodGroupUpdate.updateOne({ _id: update_id }, { $set: data });
            console.log(update);
            return update.modifiedCount > 0;
        });
    }
    findRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findRequest = yield this.bloodGroupUpdate.findById(id);
            return findRequest;
        });
    }
    saveRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const saveData = yield new this.bloodGroupUpdate(data).save();
            return saveData === null || saveData === void 0 ? void 0 : saveData.id;
        });
    }
    findAllRequest(status, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = {};
                if (status) {
                    match['status'] = status;
                }
                console.log("The status");
                console.log(status);
                console.log("Page");
                console.log(skip);
                console.log("Limit");
                console.log(limit);
                const findDonation = yield this.bloodGroupUpdate.aggregate([
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
                ]);
                console.log("response");
                console.log(findDonation);
                const response = {
                    paginated: findDonation[0].paginated,
                    total_records: findDonation[0].total_records
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
exports.default = BloodGroupUpdateRepo;
