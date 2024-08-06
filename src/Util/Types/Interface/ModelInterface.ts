import mongoose, { Document } from "mongoose"
import { BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupUpdateStatus, BloodStatus, DonorAccountBlockedReason, Relationship } from "../Enum"
import { LocatedAt } from "../Types"
// import { ÷ } from "./UtilInterface"


interface IUserBloodDonorEditable {
    full_name?: string
    locatedAt?: string,
    phoneNumber?: number,
    email_address?: string,
}

interface ISearchBloodDonorTemplate {
    donor_id?: string
    full_name?: string
    blood_group?: BloodGroup,
    locatedAt?: string,
    phoneNumber?: number,
    email_address?: string,
    status?: BloodDonorStatus
}

interface IBloodDonorTemplate {
    donor_id: string
    full_name: string
    blood_group: BloodGroup,
    locatedAt: string,
    phoneNumber: number,
    email_address: string,
    status: BloodDonorStatus,
    blocked_date?: Date
    blocked_reason?: DonorAccountBlockedReason
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
    shows_intrest_donors?: string[]
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
    shows_intrest_donors: string[]
}

interface IEditableGroupGroupRequest {
    new_group?: BloodGroup
    status?: BloodGroupUpdateStatus
}


interface IBloodGroupUpdateTemplate {
    donor_id: string,
    date: Date,
    new_group: BloodGroup,
    certificate: string,
    status: BloodGroupUpdateStatus
}

interface IBloodDonateTemplate {
    donor_id: string,
    donation_id: string
    date: Date,
    status: BloodDonationStatus
}

// interface IBloodAvailabilityResult {
//     [key in BloodGroup]: number,
// }


interface IBloodRequirement extends Document, IBloodRequirementTemplate {
    locatedAt: LocatedAt
}
interface IBloodDonor extends Document, IBloodDonorTemplate { }
interface IBloodDonorUpdate extends Document, IBloodGroupUpdateTemplate { }
interface IBloodDonate extends Document, IBloodDonateTemplate { }




export { IBloodRequirementTemplate, IBloodDonorTemplate, IBloodDonor, IEditableBloodRequirementTemplate, IUserBloodDonorEditable, IBloodDonorUpdate, IBloodGroupUpdateTemplate, IEditableGroupGroupRequest, ISearchBloodDonorTemplate, IBloodDonate, IBloodDonateTemplate }
export default IBloodRequirement