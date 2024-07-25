"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthMiddleware {
    isValidUser(req, res, next) {
        next();
    }
    isValidDonor(req, res, next) {
        next();
    }
    isValidReq(req, res, next) {
        next();
    }
}
exports.default = AuthMiddleware;
