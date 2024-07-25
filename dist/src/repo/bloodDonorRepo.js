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
class BloodDonorRepo {
    constructor() {
        this.BloodDonor = donors_1.default;
    }
    updateBloodDonor(editData, edit_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = yield this.BloodDonor.updateOne({ donor_id: edit_id }, { $set: editData });
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
}
exports.default = BloodDonorRepo;
