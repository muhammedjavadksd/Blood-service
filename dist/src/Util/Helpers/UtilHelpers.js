"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
class UtilHelper {
    generateAnOTP(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    getBloodTokenFromHeader(headers) {
        console.log(headers);
        if (headers && typeof headers == "string") {
            const splitAuth = headers.split(" ");
            if (splitAuth && splitAuth[0] == "Bearer") {
                const token = splitAuth[1];
                if (token) {
                    return token;
                }
            }
        }
        return false;
    }
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
        console.log(urlPath);
        if (splitPath && (splitPath === null || splitPath === void 0 ? void 0 : splitPath.length) >= 2) {
            const imageName = `${splitPath[1]}/${splitPath[2]}`;
            return imageName;
        }
        return false;
    }
    formatDateToMonthNameAndDate(date) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const d = new Date(date);
        const monthName = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        return `${monthName} ${day} ${year} `;
    }
}
exports.default = UtilHelper;
