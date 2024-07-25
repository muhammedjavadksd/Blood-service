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
    saveRequest(data) {
        const saveData = new this.bloodGroupUpdate(data);
        return saveData === null || saveData === void 0 ? void 0 : saveData.id;
    }
    findAllRequest(status, page, limit, perPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const findRequest = yield this.bloodGroupUpdate.find({ status }).skip(perPage * (page - 1)).limit(limit);
            return findRequest;
        });
    }
}
exports.default = BloodGroupUpdateRepo;
