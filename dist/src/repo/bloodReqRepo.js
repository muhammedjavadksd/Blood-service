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
    addIntrest(donor_id, blood_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const addIntrest = yield this.BloodReq.updateOne({ blood_id }, { $addToSet: { shows_intrest_donors: donor_id } });
            return !!addIntrest.modifiedCount;
        });
    }
    findActiveBloodReqPaginted(limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(limit, skip);
            const bloodGroup = yield this.BloodReq.find({ status: Enum_1.BloodStatus.Pending }).skip(skip).limit(limit);
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
    createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, is_closed) {
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
                const bloodRequirement = new this.BloodReq({ blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, is_closed });
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
