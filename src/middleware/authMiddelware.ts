import { Request, Response, NextFunction } from 'express'
import UtilHelper from '../Util/Helpers/UtilHelpers'
import TokenHelper from '../Util/Helpers/tokenHelper'
import { CustomRequest, IDonorJwtInterface } from '../Util/Types/Interface/UtilInterface'
import { JwtPayload } from 'jsonwebtoken'
import { StatusCode } from '../Util/Types/Enum'
import BloodReqDepo from '../repo/bloodReqRepo'
import BloodDonationRepo from '../repo/bloodDonation'
import { ObjectId } from 'mongoose'

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

    async isValidRequired(req: Request, res: Response, next: NextFunction): Promise<void> {

        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        const headers = req.headers;
        const requirement_id: ObjectId = req.params.requirement_id as unknown as ObjectId

        const authToken = headers.authorization;

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
        console.log("Eb");

        console.log("Reached my place");


        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        console.log(req.headers);
        const headers = req.headers;

        const authToken = headers.bloodauthorization;
        console.log(authToken);
        if (authToken && typeof authToken == "string") {
            const token = utilHelper.getBloodTokenFromHeader(authToken);


            if (token) {

                console.log("The token");
                console.log(token);



                // "blood_group": "A+",
                // "donor_id": "MUANBVMA+",
                // "email_address": "muhammedjavad119144@gmail.com",
                // "full_name": "Muhammed Javad",
                // "phone_number": "9744727684",
                const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
                console.log(tokenValidation);

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
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Donor is not authenticated" })
        }

    }



    async isAuthenitcated(req: CustomRequest, res: Response, next: NextFunction) {
        console.log("Reached");

        const utilHelper = new UtilHelper();
        const tokenHelper = new TokenHelper();
        console.log(req.headers);
        const headers = req.headers;
        const authToken = headers.authorization;
        const token = utilHelper.getTokenFromHeader(authToken);
        if (token) {

            console.log("token");



            const tokenValidation: JwtPayload | boolean | string = await tokenHelper.checkTokenValidity(token)
            console.log(tokenValidation);
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