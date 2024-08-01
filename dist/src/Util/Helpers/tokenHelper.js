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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenHelper {
    constructor() {
        this.checkTokenValidity = this.checkTokenValidity.bind(this);
        this.decodeJWTToken = this.decodeJWTToken.bind(this);
        this.generateJWtToken = this.generateJWtToken.bind(this);
    }
    generateJWtToken(payload, timer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwtToken = yield jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: timer });
                return jwtToken;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    decodeJWTToken(jwttoken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decode = yield jsonwebtoken_1.default.decode(jwttoken, { complete: true });
                return decode;
            }
            catch (e) {
                return null;
            }
        });
    }
    checkTokenValidity(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkValidity = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return checkValidity;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = TokenHelper;
