import mongoose, { Schema } from 'mongoose'
import { BloodGroup, BloodStatus, Relationship } from '../../Util/Types/Enum'
import IBloodRequirement from '../../Util/Types/Interface/ModelInterface';
import { LocatedAt } from '../../Util/Types/Types'

const LocatedAtSchema = new Schema({
    hospital_name: {
        type: String,
        required: true
    },
    hospital_id: {
        type: String,
        required: true
    }
});




const bloodRequirementScheme = new mongoose.Schema({
    blood_id: {
        type: String,
        required: true,
        unique: true
    },

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
        type: String,
        enum: Object.values(BloodStatus),
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
        type: String,
        enum: Object.values(BloodGroup),
        required: true
    },
    relationship: {
        type: String,
        enum: Object.values(Relationship),
        required: true,
    },
    locatedAt: {
        type: LocatedAtSchema,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    is_closed: {
        type: Boolean,
        required: true
    }
})

const BloodRequirement = mongoose.model<IBloodRequirement>("blood_requirement", bloodRequirementScheme);

export default BloodRequirement