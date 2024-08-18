"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../Util/Types/Enum");
const bloodDonorScheme = new mongoose_1.default.Schema({
    donor_id: {
        type: String,
        unique: true,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    blood_group: {
        type: String,
        enum: Object.values(Enum_1.BloodGroup),
        required: true
    },
    locatedAt: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Enum_1.BloodDonorStatus,
        required: true
    },
    blocked_date: {
        type: Date,
    },
    blocked_reason: {
        type: String,
        enum: Object.values(Enum_1.DonorAccountBlockedReason),
    }
});
const BloodDonorCollection = mongoose_1.default.model("donors", bloodDonorScheme);
exports.default = BloodDonorCollection;
