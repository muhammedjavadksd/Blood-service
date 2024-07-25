import mongoose from "mongoose";
import { BloodGroup, BloodGroupUpdateStatus } from "../../Util/Types/Enum";
import { IBloodDonorUpdate } from "../../Util/Types/Interface/ModelInterface";


const updateBloodGroupSchema = new mongoose.Schema({
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
        enum: Object.values(BloodGroup),
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(BloodGroupUpdateStatus),
        required: true
    }
})

const BloodGroupUpdate = mongoose.model<IBloodDonorUpdate>("blood_group_update", updateBloodGroupSchema);
export default BloodGroupUpdate