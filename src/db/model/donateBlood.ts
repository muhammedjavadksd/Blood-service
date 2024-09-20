
import mongoose, { Schema } from "mongoose";
import { BloodDonationStatus } from "../../Util/Types/Enum";
import { IBloodDonate } from "../../Util/Types/Interface/ModelInterface";


const bloodDonationConcers = new Schema({
    seriousConditions: {
        type: [String],
    },
    majorSurgeryOrIllness: {
        type: String
    },
    chronicIllnesses: Boolean,
    tobaco_use: Boolean
})

const bloodDonateScheme = new mongoose.Schema({
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
        enum: Object.values(BloodDonationStatus),
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
})

const DonateBlood = mongoose.model<IBloodDonate>("donate_blood", bloodDonateScheme);
export default DonateBlood