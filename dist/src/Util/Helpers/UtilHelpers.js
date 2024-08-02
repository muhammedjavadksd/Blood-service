"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
class UtilHelper {
    getTokenFromHeader(headers) {
        const splitAuth = headers === null || headers === void 0 ? void 0 : headers.split(" ");
        if (splitAuth && splitAuth[0] == "Bearer") {
            const token = splitAuth[1];
            if (token) {
                return token;
            }
        }
        return false;
    }
    createRandomText(length) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let word = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            word += letters[randomIndex];
        }
        return word.toUpperCase();
    }
    extractImageNameFromPresignedUrl(presigned_url) {
        const newUrl = url_1.default.parse(presigned_url, true);
        const urlPath = newUrl.pathname;
        const splitPath = urlPath === null || urlPath === void 0 ? void 0 : urlPath.split("/");
        if (splitPath && (splitPath === null || splitPath === void 0 ? void 0 : splitPath.length) >= 2) {
            const imageName = splitPath[2];
            return imageName;
        }
        return false;
    }
}
exports.default = UtilHelper;
