import mongoose, { Schema } from "mongoose";
import { BloodDonorStatus, BloodGroup, DonorAccountBlockedReason } from "../../Util/Types/Enum";
import { IBloodDonor, IBloodDonorTemplate, ILocatedAt } from "../../Util/Types/Interface/ModelInterface";
import { LocatedAt } from "../../Util/Types/Types";

const coordsSchema = new Schema<ILocatedAt>({
    type: {
        type: String,
        enum: ['Point'], // Ensure only 'Point' is allowed
        required: true
    },
    coordinates: {
        type: [Number],
        required: true,
    }
});

const locationSchema = new Schema<LocatedAt>({
    hospital_name: {
        type: String,
        required: true
    },
    hospital_id: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number, Number],
        required: true
    }
});

const bloodDonorScheme = new mongoose.Schema({
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
        enum: Object.values(BloodGroup),
        required: true
    },
    location_coords: {
        type: coordsSchema,
        required: true
    },
    location: {
        type: locationSchema,
        required: true,
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
        enum: BloodDonorStatus,
        required: true
    },
    blocked_date: {
        type: Date,
    },
    blocked_reason: {
        type: String,
        enum: Object.values(DonorAccountBlockedReason),
    }
});

const BloodDonorCollection = mongoose.model<IBloodDonorTemplate>("donors", bloodDonorScheme);

export default BloodDonorCollection;
