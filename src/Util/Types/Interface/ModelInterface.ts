import mongoose, { Document } from "mongoose"
import { BloodGroup, BloodGroupUpdateStatus, BloodStatus, LocatedAt, Relationship } from "../Enum"


interface IUserBloodDonorEditable {
    full_name?: string
    locatedAt?: string,
    phoneNumber?: number,
    email_address?: string,
}

interface IBloodDonorTemplate {
    donor_id: string
    full_name: string
    blood_group: BloodGroup,
    locatedAt: string,
    phoneNumber: number,
    email_address: string,
}

interface IEditableBloodRequirementTemplate {
    patientName?: string
    unit?: number,
    neededAt?: Date,
    status?: BloodStatus,
    blood_group?: BloodGroup,
    relationship?: Relationship,
    locatedAt?: LocatedAt,
    address?: String,
    phoneNumber?: number
    is_closed?: boolean
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
    is_closed: boolean
}


interface IBloodGroupUpdateTemplate {
    donor_id: string,
    date: Date,
    new_group: BloodGroup,
    certificate: string,
    status: BloodGroupUpdateStatus
}


interface IBloodRequirement extends Document, IBloodRequirementTemplate { }
interface IBloodDonor extends Document, IBloodDonorTemplate { }
interface IBloodDonorUpdate extends Document, IBloodGroupUpdateTemplate { }




export { IBloodRequirementTemplate, IBloodDonorTemplate, IBloodDonor, IEditableBloodRequirementTemplate, IUserBloodDonorEditable, IBloodDonorUpdate, IBloodGroupUpdateTemplate }
export default IBloodRequirement