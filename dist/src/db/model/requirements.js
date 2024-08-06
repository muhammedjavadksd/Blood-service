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
const LocatedAtSchema = new mongoose_1.Schema({
    hospital_name: {
        type: String,
        required: true
    },
    hospital_id: {
        type: String,
        required: true
    }
});
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
        type: LocatedAtSchema,
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
    },
    shows_intrest_donors: {
        type: [String],
        required: true
    }
});
const BloodRequirement = mongoose_1.default.model("blood_requirement", bloodRequirementScheme);
exports.default = BloodRequirement;
