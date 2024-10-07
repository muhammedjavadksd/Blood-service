import mongoose, { Document, ObjectId } from "mongoose"
import { BloodCloseCategory, BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupUpdateStatus, BloodStatus, ChatFrom, DonorAccountBlockedReason, Relationship } from "../Enum"
import { LocatedAt } from "../Types"
import { BloodDonationConcerns } from "./UtilInterface"
// import { ÷ } from "./UtilInterface"


interface IUserBloodDonorEditable {
    full_name?: string
    location_coords?: ILocatedAt,
    location?: LocatedAt,
    phoneNumber?: number,
    email_address?: string,
}

interface ISearchBloodDonorTemplate {
    donor_id?: string
    full_name?: string
    blood_group?: BloodGroup,
    locatedAt?: ILocatedAt,
    phoneNumber?: number,
    email_address?: string,
    status?: BloodDonorStatus
}

interface ILocatedAt {
    type: "Point",
    coordinates: [number, number]
}

interface IBloodDonorTemplate {
    donor_id: string
    full_name: string
    blood_group: BloodGroup,
    location_coords: ILocatedAt,
    location: LocatedAt,
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
    locatedAt?: ILocatedAt,
    address?: String,
    phoneNumber?: number
    is_closed?: boolean
    shows_intrest_donors?: string[],
    close_details?: {
        category: BloodCloseCategory,
        explanation: string
    }
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
    locatedAt: ILocatedAt,
    hospital: LocatedAt,
    address: String,
    phoneNumber: number
    is_closed: boolean,
    close_details?: {
        category: BloodCloseCategory,
        explanation: string
    }
    email_id: string
    shows_intrest_donors: string[],

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
    status: BloodDonationStatus,
    meet_expect: Date,
    concerns: BloodDonationConcerns
    certificate?: string
}

interface IMessageTemplate {
    from: ChatFrom
    timeline: string
    msg: string
    seen: boolean
}

interface IChatTemplate {
    donor_id: string
    requirement_id: string
    from_profile_id: string
    to_profile_id: string
    intrest_id: ObjectId
    chat_started: Date,
    chats: IMessageTemplate[]
}

interface IBloodRequirement extends Document, IBloodRequirementTemplate {
}
interface IBloodDonor extends Document, IBloodDonorTemplate { }
interface IBloodDonorUpdate extends Document, IBloodGroupUpdateTemplate { }
interface IBloodDonate extends Document, IBloodDonateTemplate { }
interface IChatCollection extends Document, IChatTemplate { }



export { ILocatedAt, IChatCollection, IBloodRequirementTemplate, IChatTemplate, IMessageTemplate, IBloodDonorTemplate, IBloodDonor, IEditableBloodRequirementTemplate, IUserBloodDonorEditable, IBloodDonorUpdate, IBloodGroupUpdateTemplate, IEditableGroupGroupRequest, ISearchBloodDonorTemplate, IBloodDonate, IBloodDonateTemplate }
export default IBloodRequirement