import mongoose from "mongoose";
import { BloodGroup } from "../../Util/Types/Enum";
import { IBloodDonor } from "../../Util/Types/Interface/ModelInterface";


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
        type: BloodGroup,
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
})


const BloodDonorCollection = mongoose.model<IBloodDonor>("donors", bloodDonorScheme);

export default BloodDonorCollection