"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Enum_1 = require("../../Util/Types/Enum");
const bloodDonationConcers = new mongoose_1.Schema({
    seriousConditions: {
        type: [String],
    },
    majorSurgeryOrIllness: {
        type: String
    },
    chronicIllnesses: Boolean,
    tobaco_use: Boolean
});
const bloodDonateScheme = new mongoose_1.default.Schema({
    certificate_id: String,
    donor_id: {
        type: String,
        required: true
    },
    donation_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    meet_expect: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Enum_1.BloodDonationStatus),
        required: true
    },
    unit: {
        type: Number,
        required: false
    },
    certificate: String,
    concerns: {
        type: bloodDonationConcers,
        required: true
    }
});
const DonateBlood = mongoose_1.default.model("donate_blood", bloodDonateScheme);
exports.default = DonateBlood;
