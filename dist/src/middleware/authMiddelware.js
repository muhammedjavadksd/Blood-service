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
class AuthMiddleware {
    isValidAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
        });
    }
    isValidUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new UtilHelpers_1.default();
            const tokenHelper = new tokenHelper_1.default();
            console.log(req.headers);
            const headers = req.headers;
            const authToken = headers.authorization;
            const token = utilHelper.getTokenFromHeader(authToken);
            if (token) {
                // "blood_group": "A+",
                // "donor_id": "MUANBVMA+",
                // "email_address": "muhammedjavad119144@gmail.com",
                // "full_name": "Muhammed Javad",
                // "phone_number": "9744727684",
                const tokenValidation = yield tokenHelper.checkTokenValidity(token);
                if (tokenValidation && typeof tokenValidation == "object") {
                    const donor_id = tokenValidation.donor_id;
                    if (!req.context) {
                        req.context = {};
                    }
                    req.context.donor_id = donor_id;
                    console.log("Donor middleware has passed");
                    console.log(donor_id);
                    console.log(tokenValidation);
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
    isValidDonor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
        });
    }
    isValidReq(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
        });
    }
}
exports.default = AuthMiddleware;
