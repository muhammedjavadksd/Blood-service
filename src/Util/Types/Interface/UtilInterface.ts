
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




export { HelperFunctionResponse, CustomRequest, IDonorJwtInterface }