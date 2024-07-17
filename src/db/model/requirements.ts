import mongoose from 'mongoose'
import { BloodGroup, BloodStatus, LocatedAt, Relationship } from '../../Util/Types/Enum'
import IBloodRequirement from '../../Util/Types/Interface/ModelInterface';

const bloodRequirementScheme = new mongoose.Schema({
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
        type: BloodStatus,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
    blood_group: {
        type: BloodGroup,
        required: true
    },
    relationship: {
        type: Relationship,
        required: true,
    },
    locatedAt: {
        type: LocatedAt,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})

const BloodRequirement = mongoose.model<IBloodRequirement>("blood_requirement", bloodRequirementScheme);

export default BloodRequirement