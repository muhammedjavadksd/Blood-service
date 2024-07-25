"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../Util/Types/Enum");
const updateBloodGroupSchema = new mongoose_1.default.Schema({
    donor_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    new_group: {
        type: String,
        enum: Object.values(Enum_1.BloodGroup),
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Enum_1.BloodGroupUpdateStatus),
        required: true
    }
});
const BloodGroupUpdate = mongoose_1.default.model("blood_group_update", updateBloodGroupSchema);
exports.default = BloodGroupUpdate;
