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
const LocationScheme = new mongoose_1.Schema({
    type: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number, Number],
        required: true
    }
});
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
        type: LocationScheme,
        required: true
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
