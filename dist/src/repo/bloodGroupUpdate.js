"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const updateBloodGroup_1 = __importDefault(require("../db/model/updateBloodGroup"));
class BloodGroupUpdateRepo {
    constructor() {
        this.bloodGroupUpdate = updateBloodGroup_1.default;
    }
    saveRequest(data) {
        const saveData = new this.bloodGroupUpdate(data);
        return saveData === null || saveData === void 0 ? void 0 : saveData.id;
    }
}
exports.default = BloodGroupUpdateRepo;
