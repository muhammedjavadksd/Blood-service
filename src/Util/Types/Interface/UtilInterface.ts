
import { Request } from 'express'
import { BloodGroup, StatusCode } from '../Enum'

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


export { BloodDonationValidationResult, BloodDonationConcerns, BloodDonationInterestData, HelperFunctionResponse, CustomRequest, IDonorJwtInterface }