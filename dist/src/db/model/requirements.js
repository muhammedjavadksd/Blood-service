"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../Util/Types/Enum");
const bloodRequirementScheme = new mongoose_1.default.Schema({
    blood_id: {
        type: String,
        required: true,
        unique: true
    },
    patientName: {
        type: String,
        required: true
    },
    unit: {
        type: Number,
        required: true
    },
    neededAt: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(Enum_1.BloodStatus),
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
    blood_group: {
        type: String,
        enum: Object.values(Enum_1.BloodGroup),
        required: true
    },
    relationship: {
        type: String,
        enum: Object.values(Enum_1.Relationship),
        required: true,
    },
    locatedAt: {
        type: String,
        enum: Object.values(Enum_1.LocatedAt),
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    is_closed: {
        type: Boolean,
        required: true
    }
});
const BloodRequirement = mongoose_1.default.model("blood_requirement", bloodRequirementScheme);
exports.default = BloodRequirement;
