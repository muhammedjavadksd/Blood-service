
import { Request } from 'express'
import { BloodDonorStatus, BloodGroup, StatusCode } from '../Enum'
import { IBloodDonateTemplate, IBloodDonorTemplate } from './ModelInterface'

interface CustomRequest extends Request {
    context?: Record<any, any>
}

interface HelperFunctionResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: object
}


interface IDonorJwtInterface {
    donor_id: string,
    full_name: string,
    blood_group: BloodGroup,
    phone_number: number,
    email_address: string
}

interface BloodDonationConcerns {
    seriousConditions: string[]
    majorSurgeryOrIllness: string | null,
    chronicIllnesses: boolean
    tobaco_use: boolean
}


interface IChatNotification {
    msg: string,
    subject: string,
    email_id: string,
    reciver_name: string,
    from_name: string
}

interface IPaginatedResponse<T> {
    paginated: []
    total_records: number
}

interface BloodDonationValidationResult {
    errors: string[];
    concerns: BloodDonationConcerns;
}

interface BloodDonationInterestData {
    donatedLast90Days: boolean;
    weight: string;
    seriousConditions: string[];
    majorSurgeryOrIllness: string;
    surgeryOrIllnessDetails?: string; // Optional
    chronicIllnesses: string;
    tattooPiercingAcupuncture: string;
    alcoholConsumption: string;
    tobaccoUse: string;
    pregnancyStatus: string;
    date: Date;
}

interface IProfileCard {
    profile: IBloodDonorTemplate,
    blood_group: BloodGroup,
    donated_blood: number,
    blood_requirements: number,
    expressed_intrest: number,
    status: BloodDonorStatus,
    matched_profile: number
}




export { IProfileCard, IPaginatedResponse, BloodDonationValidationResult, BloodDonationConcerns, BloodDonationInterestData, HelperFunctionResponse, CustomRequest, IDonorJwtInterface, IChatNotification }