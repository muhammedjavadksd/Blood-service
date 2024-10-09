import { Request, Response, NextFunction } from 'express'
import UtilHelper from '../Util/Helpers/UtilHelpers'
import TokenHelper from '../Util/Helpers/tokenHelper'
import { CustomRequest } from '../Util/Types/Interface/UtilInterface'
import { JwtPayload } from 'jsonwebtoken'
import { StatusCode } from '../Util/Types/Enum'
import BloodReqDepo from '../repo/bloodReqRepo'
import BloodDonationRepo from '../repo/bloodDonation'
import { ObjectId } from 'mongoose'

interface IAuthMiddleware {
    isValidDonor(req: Request, res: Response, next: NextFunction): Promise<void>
    isAuthenitcated(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidRequired(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
}

class AuthMiddleware implements IAuthMiddleware {

    async isValidAdmin(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        const headers: CustomRequest['headers'] = req.headers;
        const token: string | false = utilHelper.getTokenFromHeader(headers['authorization'])

        if (token) {
            if (!req.context) {
                req.context = {}
            }
            req.context.auth_token = token;
            const checkValidity: JwtPayload | string | boolean = await tokenHelper.checkTokenValidity(token);

            if (checkValidity && typeof checkValidity == "object") {
                const emailAddress: string = checkValidity.email || checkValidity.email_address;
                if (emailAddress && checkValidity.role == "admin") {
                    req.context.email_id = emailAddress;
                    req.context.token = token;
                    req.context.user_id = checkValidity.user_id;
                    next();
                    return
                }
            }
            res.status(StatusCode.UNAUTHORIZED).json({
                status: false,
                msg: "Authorization is failed"
            });
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({
                status: false,
                msg: "Invalid auth attempt"
            });
        }
    }

    async isValidRequired(req: Request, res: Response, next: NextFunction): Promise<void> {

        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        const headers = req.headers;
        const requirement_id: ObjectId = req.params.requirement_id as unknown as ObjectId
        const authToken: string | undefined = headers.authorization;

        if (authToken && typeof authToken == "string") {
            const token = utilHelper.getBloodTokenFromHeader(authToken);
            if (token && requirement_id) {
                const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
                if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.profile_id) {
                    const reqRepo = new BloodReqDepo();
                    const bloodDonationRepo = new BloodDonationRepo()
                    const findDonation = await bloodDonationRepo.findDonationById(requirement_id);
                    if (findDonation && findDonation.donation_id) {
                        const donate_id = findDonation.donation_id;
                        const requirement = await reqRepo.findBloodRequirementByBloodId(donate_id);
                        if (requirement && requirement.profile_id == tokenValidation.profile_id) {
                            next()
                            return;
                        }
                    }
                }
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
            } else {
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
        }
    }

    async isValidDonor(req: CustomRequest, res: Response, next: NextFunction) {

        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        const headers = req.headers;
        const authToken = headers.bloodauthorization;
        if (authToken && typeof authToken == "string") {
            const token = utilHelper.getBloodTokenFromHeader(authToken);

            if (token) {
                const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
                if (tokenValidation && typeof tokenValidation == "object" && tokenValidation.donor_id) {
                    const donor_id = tokenValidation.donor_id;
                    if (!req.context) {
                        req.context = {}
                    }
                    req.context.donor_id = donor_id;
                    next()
                } else {
                    res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
                }
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
                next()
            } else {
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
        }
    }
}

export default AuthMiddleware