import { Request, Response, NextFunction } from 'express'
import UtilHelper from '../Util/Helpers/UtilHelpers'
import TokenHelper from '../Util/Helpers/tokenHelper'
import { CustomRequest, IDonorJwtInterface } from '../Util/Types/Interface/UtilInterface'
import { JwtPayload } from 'jsonwebtoken'
import { StatusCode } from '../Util/Types/Enum'

interface IAuthMiddleware {
    isValidDonor(req: Request, res: Response, next: NextFunction): Promise<void>
    isAuthenitcated(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidReq(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
}

class AuthMiddleware implements IAuthMiddleware {

    async isValidAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        next()
    }

    async isValidDonor(req: CustomRequest, res: Response, next: NextFunction) {
        console.log("Eb");

        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        console.log(req.headers);
        const headers = req.headers;

        const authToken = headers.authorization;
        const token = utilHelper.getTokenFromHeader(authToken);
        if (token) {

            // "blood_group": "A+",
            // "donor_id": "MUANBVMA+",
            // "email_address": "muhammedjavad119144@gmail.com",
            // "full_name": "Muhammed Javad",
            // "phone_number": "9744727684",
            const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
            if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.donor_id) {
                const donor_id = tokenValidation.donor_id;
                if (!req.context) {
                    req.context = {}
                }
                req.context.donor_id = donor_id;
                console.log("Donor middleware has passed");
                console.log(donor_id);
                console.log(tokenValidation);
                next()
            } else {
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
        }
    }

    async isAuthenitcated(req: CustomRequest, res: Response, next: NextFunction) {
        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        console.log(req.headers);
        const headers = req.headers;
        const authToken = headers.authorization;
        const token = utilHelper.getTokenFromHeader(authToken);
        if (token) {


            const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
            if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.profile_id && tokenValidation.user_id) {
                const profile_id = tokenValidation.profile_id;
                const user_id = tokenValidation.user_id;
                if (!req.context) {
                    req.context = {}
                }
                req.context.profile_id = profile_id;
                req.context.user_id = user_id;
                console.log("Donor middleware has passed");
                console.log(profile_id);
                console.log(tokenValidation);
                next()
            } else {
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
        }
    }

    async isValidReq(req: Request, res: Response, next: NextFunction) {
        next()
    }
}

export default AuthMiddleware