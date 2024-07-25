"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBloodRequestUpdateCertificate = void 0;
const multer_1 = __importDefault(require("multer"));
exports.saveBloodRequestUpdateCertificate = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/blood_certificate');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if (!req.context) {
            req.context = {};
        }
        req.context.certificate_name = uniqueSuffix;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
