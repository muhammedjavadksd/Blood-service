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
const bloodService_1 = __importDefault(require("../service/bloodService"));
class AdminController {
    constructor() {
        this.bloodService = new bloodService_1.default();
    }
    updateBloodRequirements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blood_id = req.params.blood_id;
            const status = req.params.status;
            const update = yield this.bloodService.updateProfileStatus(blood_id, status);
            res.status(update.statusCode).json({ status: update.status, msg: update.msg, data: update.data });
        });
    }
    getAllRequirements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = +req.params.page;
            const limit = +req.params.limit;
            const findProfile = yield this.bloodService.findPaginatedBloodRequirements(page, limit);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        });
    }
    // limit/:skip/:per_page
    bloodGroupChangeRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(req.params.limit);
            const skip = parseInt(req.params.skip);
            const per_page = parseInt(req.params.per_page);
            const status = req.params.status;
            const findRequets = yield this.bloodService.findBloodGroupChangeRequets(status, skip, limit, per_page);
            res.status(findRequets.statusCode).json({ status: findRequets.status, msg: findRequets.msg, data: findRequets.data });
        });
    }
    updateBloodGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const request_id = req.params.request_id;
            const status = req.params.new_status;
            const updateBloodGroup = yield this.bloodService.updateBloodGroup(request_id, status);
            res.status(updateBloodGroup.statusCode).json({ status: updateBloodGroup.status, msg: updateBloodGroup.msg });
        });
    }
}
exports.default = AdminController;
