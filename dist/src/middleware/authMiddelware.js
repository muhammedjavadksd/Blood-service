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
const UtilHelpers_1 = __importDefault(require("../Util/Helpers/UtilHelpers"));
const tokenHelper_1 = __importDefault(require("../Util/Helpers/tokenHelper"));
const Enum_1 = require("../Util/Types/Enum");
const bloodReqRepo_1 = __importDefault(require("../repo/bloodReqRepo"));
const bloodDonation_1 = __importDefault(require("../repo/bloodDonation"));
class AuthMiddleware {
    isValidAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new UtilHelpers_1.default();
            const tokenHelper = new tokenHelper_1.default();
            const headers = req.headers;
            const token = utilHelper.getTokenFromHeader(headers['authorization']);
            if (token) {
                if (!req.context) {
                    req.context = {};
                }
                req.context.auth_token = token;
                const checkValidity = yield tokenHelper.checkTokenValidity(token);
                if (checkValidity && typeof checkValidity == "object") {
                    const emailAddress = checkValidity.email || checkValidity.email_address;
                    if (emailAddress && checkValidity.role == "admin") {
                        req.context.email_id = emailAddress;
                        req.context.token = token;
                        req.context.user_id = checkValidity.user_id;
                        next();
                        return;
                    }
                }
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({
                    status: false,
                    msg: "Authorization is failed"
                });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({
                    status: false,
                    msg: "Invalid auth attempt"
                });
            }
        });
    }
    isValidRequired(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new UtilHelpers_1.default();
            const tokenHelper = new tokenHelper_1.default();
            const headers = req.headers;
            const requirement_id = req.params.requirement_id;
            const authToken = headers.authorization;
            if (authToken && typeof authToken == "string") {
                const token = utilHelper.getBloodTokenFromHeader(authToken);
                if (token && requirement_id) {
                    const tokenValidation = yield tokenHelper.checkTokenValidity(token);
                    if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.profile_id) {
                        const reqRepo = new bloodReqRepo_1.default();
                        const bloodDonationRepo = new bloodDonation_1.default();
                        const findDonation = yield bloodDonationRepo.findDonationById(requirement_id);
                        if (findDonation && findDonation.donation_id) {
                            const donate_id = findDonation.donation_id;
                            const requirement = yield reqRepo.findBloodRequirementByBloodId(donate_id);
                            if (requirement && requirement.profile_id == tokenValidation.profile_id) {
                                next();
                                return;
                            }
                        }
                    }
                    res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
                }
                else {
                    res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
                }
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
            }
        });
    }
    isValidDonor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new UtilHelpers_1.default();
            const tokenHelper = new tokenHelper_1.default();
            const headers = req.headers;
            const authToken = headers.bloodauthorization;
            if (authToken && typeof authToken == "string") {
                const token = utilHelper.getBloodTokenFromHeader(authToken);
                if (token) {
                    const tokenValidation = yield tokenHelper.checkTokenValidity(token);
                    if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.donor_id) {
                        const donor_id = tokenValidation.donor_id;
                        if (!req.context) {
                            req.context = {};
                        }
                        req.context.donor_id = donor_id;
                        next();
                    }
                    else {
                        res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
                    }
                }
                else {
                    res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
                }
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
            }
        });
    }
    isAuthenitcated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new UtilHelpers_1.default();
            const tokenHelper = new tokenHelper_1.default();
            const headers = req.headers;
            const authToken = headers.authorization;
            const token = utilHelper.getTokenFromHeader(authToken);
            if (token) {
                const tokenValidation = yield tokenHelper.checkTokenValidity(token);
                if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.profile_id && tokenValidation.user_id) {
                    const profile_id = tokenValidation.profile_id;
                    const user_id = tokenValidation.user_id;
                    if (!req.context) {
                        req.context = {};
                    }
                    req.context.profile_id = profile_id;
                    req.context.user_id = user_id;
                    next();
                }
                else {
                    res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
                }
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" });
            }
        });
    }
}
exports.default = AuthMiddleware;
