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
}
exports.default = AdminController;
