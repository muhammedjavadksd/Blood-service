import mongoose from "mongoose";
import { BloodDonationStatus } from "../../Util/Types/Enum";
import { IBloodDonate } from "../../Util/Types/Interface/ModelInterface";

const bloodDonateScheme = new mongoose.Schema({
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
        enum: Object.values(BloodDonationStatus),
        required: true
    },
})

const DonateBlood = mongoose.model<IBloodDonate>("donate_blood", bloodDonateScheme);
export default DonateBlood