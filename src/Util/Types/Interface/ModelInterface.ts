import mongoose, { Document } from "mongoose"
import { BloodGroup, BloodStatus, LocatedAt, Relationship } from "../Enum"


interface IBloodDonorTemplate {
    donor_id: string
    full_name: string
    blood_group: BloodGroup,
    locatedAt: LocatedAt,
    phoneNumber: number,
    email_address: string,
}

interface IBloodRequirementTemplate {
    blood_id: string
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

interface IBloodRequirement extends Document, IBloodRequirementTemplate { }
interface IBloodDonor extends Document, IBloodDonorTemplate { }




export { IBloodRequirementTemplate, IBloodDonorTemplate, IBloodDonor }
export default IBloodRequirement