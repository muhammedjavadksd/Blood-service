import mongoose, { Schema } from 'mongoose'
import { BloodCloseCategory, BloodGroup, BloodStatus, Relationship } from '../../Util/Types/Enum'
import IBloodRequirement from '../../Util/Types/Interface/ModelInterface';
import { LocatedAt } from '../../Util/Types/Types';

const LocatedAtSchema = new Schema<LocatedAt>({
    coordinates: {
        type: [String, String],
        required: true
    },
    hospital_id: {
        type: String,
        required: true
    },
    hospital_name: {
        type: String,
        required: true
    }
});

const closeDetailsSchma = new Schema({
    category: {
        type: String,
        required: true,
        enum: Object.values(BloodCloseCategory)
    },
    explanation: {
        type: String,
        required: true
    }
})

const bloodRequirementScheme = new mongoose.Schema<IBloodRequirement>({
    blood_id: {
        type: String,
        required: true,
        unique: true
    },
    email_id: {
        type: String,
        required: true,
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
        type: Schema.Types.ObjectId,
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
        enum: [...Object.values(Relationship), "Admin"],
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
    },
    shows_intrest_donors: {
        type: [String],
        required: true
    },
    close_details: {
        type: closeDetailsSchma
    }
})

const BloodRequirement = mongoose.model<IBloodRequirement>("blood_requirement", bloodRequirementScheme);

export default BloodRequirement