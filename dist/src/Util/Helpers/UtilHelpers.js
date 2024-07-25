"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UtilHelper {
    createRandomText(length) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let word = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            word += letters[randomIndex];
        }
        return word.toUpperCase();
    }
}
exports.default = UtilHelper;
