import mongoose, { Schema } from "mongoose";
import { BloodDonorStatus, BloodGroup, DonorAccountBlockedReason } from "../../Util/Types/Enum";
import { IBloodDonor, IBloodDonorTemplate, ILocatedAt } from "../../Util/Types/Interface/ModelInterface";


const LocationScheme = new Schema<ILocatedAt>({
    accuracy: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
})

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
})


const BloodDonorCollection = mongoose.model<IBloodDonorTemplate>("donors", bloodDonorScheme);

export default BloodDonorCollection