import mongoose from "mongoose";
import { BloodDonorStatus, BloodGroup, DonorAccountBlockedReason } from "../../Util/Types/Enum";
import { IBloodDonor, IBloodDonorTemplate } from "../../Util/Types/Interface/ModelInterface";


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