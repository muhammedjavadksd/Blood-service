import mongoose, { Document } from "mongoose"
import { BloodGroup, BloodStatus, LocatedAt, Relationship } from "../Enum"


interface IBloodRequirementTemplate {
    patientName: string
    unit: number,
    neededAt: Date,
    status: BloodStatus,
    user_id: mongoose.Types.ObjectId,
    profile_id: string,
    blood_group: BloodGroup,
    relationship: Relationship,
    locatedAt: LocatedAt,
    address: String,
    phoneNumber: number
}

interface IBloodRequirement extends IBloodRequirementTemplate, Document { }

export { IBloodRequirementTemplate }
export default IBloodRequirement