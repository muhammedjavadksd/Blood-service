
import { Request } from 'express'
import { StatusCode } from '../Enum'

interface CustomRequest extends Request {
    context?: Record<any, any>
}

interface HelperFunctionResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: object
}


interface LocatedAt {
    hospital_name: string,
    hospital_id: string
}


export { HelperFunctionResponse, CustomRequest, LocatedAt }