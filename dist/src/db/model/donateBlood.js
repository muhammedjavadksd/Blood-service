"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../Util/Types/Enum");
const bloodDonateScheme = new mongoose_1.default.Schema({
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
    status: {
        type: String,
        enum: Object.values(Enum_1.BloodDonationStatus),
        required: true
    },
});
const DonateBlood = mongoose_1.default.model("donate_blood", bloodDonateScheme);
exports.default = DonateBlood;
