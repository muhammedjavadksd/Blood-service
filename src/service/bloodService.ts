import mongoose, { ObjectId } from "mongoose";
import { BloodCloseCategory, BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodGroupUpdateStatus, BloodStatus, ChatFrom, DonorAccountBlockedReason, ExtendsRelationship, JwtTimer, Relationship, S3FolderName, StatusCode } from "../Util/Types/Enum";
import { BloodDonationConcerns, BloodDonationInterestData, BloodDonationValidationResult, HelperFunctionResponse, IChatNotification, IPaginatedResponse, IProfileCard } from "../Util/Types/Interface/UtilInterface";
import { IBloodAvailabilityResult, LocatedAt, mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodReqRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import IBloodRequirement, { IBloodDonate, IBloodDonateTemplate, IBloodDonor, IBloodDonorTemplate, IBloodGroupUpdateTemplate, IBloodRequirementTemplate, IEditableBloodRequirementTemplate, IEditableGroupGroupRequest, ILocatedAt, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorRepo from "../repo/bloodDonorRepo";
import BloodGroupUpdateRepo from "../repo/bloodGroupUpdate";
import BloodDonationRepo from "../repo/bloodDonation";
import TokenHelper from "../Util/Helpers/tokenHelper";
import e from "express";
import BloodNotificationProvider from "../communication/Provider/notification_service";
import axios from "axios";
import ProfileChat from "../communication/ApiCommunication/ProfileChatApiCommunication";
import { skip } from "node:test";
// import ChatService from "./chatService";
import PDFDocument from 'pdfkit'
import qrcode from 'qrcode'
import path from 'path'
import fs from 'fs'
import S3BucketHelper from "../Util/Helpers/S3Helper";
import { config } from 'dotenv'


interface IBloodService {
    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number, email_address: string): Promise<HelperFunctionResponse>
    createBloodId(blood_group: BloodGroup, unit: number): Promise<string>
    bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: ILocatedAt): Promise<HelperFunctionResponse>
    createDonorId(blood_group: BloodGroup, fullName: string): Promise<string>
    closeRequest(blood_id: string, category: BloodCloseCategory, explanation: string): Promise<HelperFunctionResponse>
    updateBloodDonors(editData: IUserBloodDonorEditable, edit_id: string): Promise<HelperFunctionResponse>
    updateBloodGroupRequest(newGroup: string, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse>
    updateBloodGroupRequest(newGroup: string, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse>
    updateBloodGroup(request_id: ObjectId, newStatus: BloodGroupUpdateStatus): Promise<HelperFunctionResponse>
    findBloodGroupChangeRequets(status: BloodGroupUpdateStatus, page: number, limit: number): Promise<HelperFunctionResponse>
    findBloodAvailability(status: BloodDonorStatus, blood_group: BloodGroup): Promise<HelperFunctionResponse>
    // donateBlood(donor_id: string, donation_id: string, status: BloodDonationStatus): Promise<HelperFunctionResponse>
    findRequest(donor_id: string, blood_id: string, page: number, limit: number): Promise<HelperFunctionResponse>
    findActivePaginatedBloodRequirements(page: number, limit: number): Promise<HelperFunctionResponse>
    findPaginatedBloodRequirements(page: number, limit: number): Promise<HelperFunctionResponse>
    showIntrest(auth_token: string, profile_id: string, donor_id: string, request_id: string, concers: BloodDonationConcerns, date: Date): Promise<HelperFunctionResponse>
    findMyIntrest(donor_id: string, limit: number, page: number, status: BloodDonationStatus): Promise<HelperFunctionResponse>
    findMyRequest(profile_id: string, page: number, limit: number, status: BloodStatus): Promise<HelperFunctionResponse>
    updateRequestStatus(request_id: ObjectId, status: BloodDonationStatus, unit: number): Promise<HelperFunctionResponse>
    // updateBloodReqStatus(request_id: ObjectId, status: BloodStatus): Promise<HelperFunctionResponse>
    updateProfileStatus(blood_id: string, status: BloodStatus): Promise<HelperFunctionResponse>
    donationHistory(donor_id: string, limit: number, page: number): Promise<HelperFunctionResponse>
    findDonorProfile(donor_id: string, profile_id: string): Promise<HelperFunctionResponse>
    advanceBloodBankSearch(page: number, limit: number, blood_group: BloodGroup, urgency: boolean, hospital: string): Promise<HelperFunctionResponse>
    findNearestBloodDonors(page: number, limit: number, location: [number, number], group: BloodGroup): Promise<HelperFunctionResponse>
    findSingleBloodRequirement(requirement_id: string, status: BloodStatus): Promise<HelperFunctionResponse>
    searchBloodDonors(page: number, limit: number, bloodGroup: BloodGroup, status: BloodDonorStatus): Promise<HelperFunctionResponse>
}

class BloodService implements IBloodService {

    private readonly bloodReqRepo: BloodRepo;
    private readonly bloodDonorRepo: BloodDonorRepo;
    private readonly bloodGroupUpdateRepo: BloodGroupUpdateRepo;
    private readonly bloodDonationRepo: BloodDonationRepo;
    private readonly utilHelper: UtilHelper;
    // private readonly chatService: ChatService



    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.createBloodId = this.createBloodId.bind(this)
        this.bloodDonation = this.bloodDonation.bind(this)
        this.createDonorId = this.createDonorId.bind(this)
        this.closeRequest = this.closeRequest.bind(this)
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.findMyIntrest = this.findMyIntrest.bind(this)
        this.updateRequestStatus = this.updateRequestStatus.bind(this)
        this.donationHistory = this.donationHistory.bind(this)
        this.findNearestBloodDonors = this.findNearestBloodDonors.bind(this)
        this.bloodReqRepo = new BloodRepo();
        this.bloodDonorRepo = new BloodDonorRepo();
        this.bloodGroupUpdateRepo = new BloodGroupUpdateRepo();
        this.bloodDonationRepo = new BloodDonationRepo();
        this.utilHelper = new UtilHelper();
        config()
        // this.chatService = new ChatService();
    }





    async searchBloodDonors(page: number, limit: number, bloodGroup: BloodGroup, status: BloodDonorStatus): Promise<HelperFunctionResponse> {

        const skip: number = (page - 1) * limit;
        const findProfile = await this.bloodDonorRepo.findDonorsPaginated(limit, skip, { status, blood_group: bloodGroup });
        if (findProfile.paginated.length) {
            return {
                status: true,
                msg: "Donors found",
                statusCode: StatusCode.OK,
                data: findProfile
            }
        } else {
            return {
                status: false,
                msg: "No profile found",
                statusCode: StatusCode.NOT_FOUND
            }
        }

    }

    async findSingleBloodRequirement(requirement_id: string, status?: BloodStatus): Promise<HelperFunctionResponse> {

        const findreq = await this.bloodReqRepo.findSingleBloodRequirement(requirement_id, status);
        if (findreq) {
            return {
                msg: "Requirement found",
                status: true,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                msg: "No data found",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async updateProfileStatus(blood_id: string, status: BloodStatus): Promise<HelperFunctionResponse> {
        const bloodStatus = await this.bloodReqRepo.updateBloodRequirement(blood_id, status);
        if (bloodStatus) {
            return {
                status: true,
                msg: "Blood requirment update success",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "Blood requirment update failed",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async findPaginatedBloodRequirements(page: number, limit: number, status?: BloodStatus): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        const find = await this.bloodReqRepo.findBloodReqPaginted(limit, skip, status);
        if (find.paginated.length) {
            return {
                status: true,
                msg: "Requirement's found",
                statusCode: StatusCode.OK,
                data: find
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }


    async findNearestBloodDonors(page: number, limit: number, location: [number, number], group: BloodGroup): Promise<HelperFunctionResponse> {

        const skip: number = (page - 1) * limit;
        const find = await this.bloodDonorRepo.nearBySearch(location, limit, skip, group);
        if (find.total_records) {
            return {
                status: true,
                msg: "Donors found",
                statusCode: StatusCode.OK,
                data: find
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }


    async advanceBloodBankSearch(page: number, limit: number, blood_group?: BloodGroup, urgency?: boolean, hospital?: string): Promise<HelperFunctionResponse> {

        const filter: Record<string, any> = {}
        if (blood_group) {
            filter['blood_group'] = blood_group
        }

        const date = new Date()
        const maxDate = date.setDate(date.getDate() + 1);
        if (urgency) {
            filter['neededAt'] = {
                $lte: maxDate
            }
        }
        if (hospital) {
            filter['locatedAt.hospital_id'] = hospital;
        }

        const skip = (page - 1) * limit
        const findData: IPaginatedResponse<IBloodRequirement[]> = await this.bloodReqRepo.advanceFilter(filter, limit, skip)
        if (findData.paginated) {
            return {
                status: true,
                msg: "Found result",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async findDonorProfile(donor_id: string, profile_id: string): Promise<HelperFunctionResponse> {

        try {


            const profile: IBloodDonorTemplate | null = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
            const findDonatedHistory: number = (await this.bloodDonationRepo.findMyDonation(donor_id, 0, 1)).total_records
            const bloodRequirement: number = (await this.bloodReqRepo.findUserRequirement(profile_id, 0, 1)).total_records
            const expressedIntrest: number = (await this.bloodDonationRepo.findMyIntrest(donor_id, 0, 10)).total_records
            const matchedProfile: number = profile ? (await this.bloodReqRepo.findActiveBloodReq(profile.blood_group)).length : 0

            if (profile) {
                const profileCard: IProfileCard = {
                    profile,
                    blood_group: profile?.blood_group,
                    donated_blood: findDonatedHistory,
                    blood_requirements: bloodRequirement,
                    expressed_intrest: expressedIntrest,
                    status: profile?.status,
                    matched_profile: matchedProfile
                }
                return {
                    status: true,
                    msg: "Profile fetch success",
                    statusCode: StatusCode.OK,
                    data: {
                        profile: profileCard
                    }
                }
            } else {
                console.log("Profile not found");

                return {
                    status: false,
                    msg: "̉No profile found",
                    statusCode: StatusCode.BAD_REQUEST,
                }
            }

        } catch (e) {
            console.log(e);

            return {
                msg: "Profile fetching failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async donationHistory(donor_id: string, limit: number, page: number): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit
        const findHistory: IPaginatedResponse<IBloodDonate[]> = await this.bloodDonationRepo.findMyDonation(donor_id, skip, limit);
        if (findHistory.total_records) {
            return {
                status: true,
                msg: "History fetched",
                statusCode: StatusCode.OK,
                data: findHistory
            }
        } else {
            return {
                status: false,
                msg: "No history found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }


    async createCertificateId() {
        const utilHelper = new UtilHelper();
        let randomNumber: number = utilHelper.generateAnOTP(4);
        let randomText: string = utilHelper.createRandomText(4);
        let certificate = `BD${randomText}-${randomNumber}`;
        let findCertificate = await this.bloodDonationRepo.findByCertificateId(certificate);
        while (findCertificate) {
            randomNumber++
            certificate = `BD${randomText}-${randomNumber}`;
            findCertificate = await this.bloodDonationRepo.findByCertificateId(certificate);
        }
        return certificate
    }

    async bloodDonationCertificate(donor_name: string, blood_group: string, unit: number, date: string, certificateId: string) {
        return new Promise(async (resolve, reject) => {


            try {

                const s3Helper = new S3BucketHelper(process.env.BLOOD_BUCKET || "", S3FolderName.bloodCertification);
                const fileName = `${certificateId}.pdf`
                const presignedUrl = await s3Helper.generatePresignedUrl(fileName);
                const qr = await qrcode.toDataURL(certificateId);

                const doc = new PDFDocument({
                    layout: 'landscape',
                    size: 'A4',
                });

                function jumpLine(doc: PDFKit.PDFDocument, lines: number) {
                    for (let index = 0; index < lines; index++) {
                        doc.moveDown();
                    }
                }

                const distanceMargin = 18;
                const maxWidth = 140;
                const maxHeight = 70;
                doc.pipe(fs.createWriteStream('output.pdf'));
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
                doc.fontSize(10);
                doc.fillAndStroke('#9e0000').lineWidth(20).lineJoin('round').rect(
                    distanceMargin,
                    distanceMargin,
                    doc.page.width - distanceMargin * 2,
                    doc.page.height - distanceMargin * 2,
                ).stroke();

                const avatarImage = await axios.get('https://lifelink-blood-bank.s3.amazonaws.com/other-images/blood.png', { responseType: "arraybuffer" })
                const signBuffer = await axios.get('https://fund-raiser.s3.amazonaws.com/other-images/sign.png', { responseType: "arraybuffer" })
                doc.image(avatarImage.data, doc.page.width / 2 - maxWidth / 2, 60, {
                    fit: [140, 50],
                    align: 'center',
                });

                jumpLine(doc, 5)

                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text('Life link blood  donation certificate', {
                        align: 'center',
                    });

                jumpLine(doc, 2)

                // Content
                doc
                    .fontSize(16)
                    .fill('#021c27')
                    .text(`This is certify of the blood donation`, {
                        align: 'center',
                    });

                jumpLine(doc, 1)

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Present to', {
                        align: 'center',
                    });

                jumpLine(doc, 2)

                doc

                    .fontSize(24)
                    .fill('#021c27')
                    .text(donor_name, {
                        align: 'center',
                    });

                jumpLine(doc, 1)

                doc
                    .fontSize(15)
                    .fill('#021c27')
                    .text(`Successfully donated ${blood_group} (${unit} unit) on May ${date}`, {
                        align: 'center',
                    });

                jumpLine(doc, 1)
                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text(`"We're thrilled to have you with us on this journey. Thank you!"`, {
                        align: 'center',
                    });
                jumpLine(doc, 7)

                doc.lineWidth(1);

                // Signatures
                const lineSize = 174;
                const signatureHeight = 390;

                doc.fillAndStroke('#021c27');
                doc.strokeOpacity(0.2);

                const startLine1 = 128;
                const endLine1 = 128 + lineSize;
                doc
                    .moveTo(startLine1, signatureHeight)
                    .lineTo(endLine1, signatureHeight)
                    .stroke();

                const startLine2 = endLine1 + 32;
                const endLine2 = startLine2 + lineSize;


                const startLine3 = endLine2 + 32;
                const endLine3 = startLine3 + lineSize;

                doc.image(signBuffer.data, (doc.page.width / 2 - maxWidth / 2) + 40, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });


                doc.image(signBuffer.data, 600, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });



                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('John Doe', startLine1, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Associate Professor', startLine1, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text(donor_name, startLine2, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Name', startLine2, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Jane Doe', startLine3, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc.image(signBuffer.data, 180, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Director', startLine3, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc
                    .moveTo(startLine3, signatureHeight)
                    .lineTo(endLine3, signatureHeight)
                    .stroke();
                jumpLine(doc, 4);

                doc
                    .moveTo(startLine2, signatureHeight)
                    .lineTo(endLine2, signatureHeight)
                    .stroke();

                doc.fontSize(10)
                    .fill('#021c27')
                    .text('Scan below QRCODE for verification', 330, 450, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc.image(qr, 380, 470, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });


                const pathResolve = path.resolve(process.cwd(), "output.pdf")
                doc.on("end", async function () {
                    fs.readFile(pathResolve, async function (err, data) {
                        if (err) {
                            console.log(err);
                            reject(null)
                        }

                        console.log(presignedUrl);
                        const savedName = await s3Helper.uploadFile(data, presignedUrl, "application/pdf", fileName) //S3BucketHelper.uploadFile(data, presignedUrl, "application/pdf", fileName)

                        console.log(savedName);
                        if (savedName) {
                            resolve(savedName)
                        } else {
                            reject(null)
                        }
                    });
                })
                doc.end()
            } catch (e) {
                console.log(e);
                reject(null)
            }
        })
    }

    async updateRequestStatus(request_id: ObjectId, status: BloodDonationStatus, unit: number): Promise<HelperFunctionResponse> {

        try {
            const findRequest = await this.bloodDonationRepo.findDonationById(request_id);
            console.log(findRequest);
            console.log(request_id);


            if (findRequest) {
                if (findRequest.status == BloodDonationStatus.Approved) {
                    return {
                        status: false,
                        msg: "Its already approved",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                } else if (findRequest.status == status) {
                    return {
                        status: false,
                        msg: "Please update with new status",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                } else {
                    const updateRequest = await this.bloodDonationRepo.updateStatus(request_id, status);
                    await this.bloodDonationRepo.updateUnit(request_id, unit);


                    if (updateRequest) {
                        if (status == BloodDonationStatus.Approved) {
                            try {
                                this.bloodDonorRepo.findBloodDonorByDonorId(findRequest.donor_id).then((donor) => {
                                    this.bloodReqRepo.findBloodRequirementByBloodId(findRequest.donation_id).then(async (req) => {
                                        if (donor && req) {
                                            const certificateId = await this.createCertificateId()

                                            this.bloodDonationCertificate(donor?.full_name, req?.blood_group, unit, this.utilHelper.formatDateToMonthNameAndDate(findRequest.date), certificateId).then(async (certificateUpdate) => {
                                                if (certificateUpdate && typeof certificateUpdate == "string") {
                                                    await this.bloodDonationRepo.updateCertificate(request_id, certificateUpdate, certificateId)
                                                }
                                            })
                                        }

                                    })
                                })
                            } catch (e) {
                                console.log("Certificate update failed");
                            }
                        }
                        return {
                            status: true,
                            msg: "Status has been updated",
                            statusCode: StatusCode.OK
                        }
                    } else {
                        return {
                            status: false,
                            msg: "Something went wrong",
                            statusCode: StatusCode.BAD_REQUEST
                        }
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Invalid request",
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } catch (e) {
            return {
                status: false,
                msg: "Internal server error",
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async findMyRequest(profile_id: string, page: number, limit: number, status: BloodStatus): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        const findRequest = await this.bloodReqRepo.findUserRequirement(profile_id, skip, limit, status);
        if (findRequest.total_records) {
            return {
                status: true,
                msg: "Fetch all profile",
                data: findRequest,
                statusCode: StatusCode.OK
            }
        } else {
            console.log("Not found result");

            return {
                status: false,
                msg: "No profile found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async findMyIntrest(donor_id: string, limit: number, page: number, status: BloodDonationStatus): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit;
        console.log(donor_id, skip, limit);

        const myIntrest = await this.bloodDonationRepo.findMyIntrest(donor_id, skip, limit, status) //this.bloodReqRepo.findMyIntrest(donor_id);
        console.log("My intrest");
        console.log(myIntrest);


        if (myIntrest.total_records) {
            return {
                status: true,
                msg: "Fetched all intrest",
                data: myIntrest,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }




    bloodDonationInterestValidation(data: BloodDonationInterestData) {
        const errors: string[] = [];
        const concerns: BloodDonationConcerns = {
            seriousConditions: [],
            majorSurgeryOrIllness: null,
            chronicIllnesses: false,
            tobaco_use: false
        };

        const {
            donatedLast90Days = true,
            weight = '',
            seriousConditions = [],
            majorSurgeryOrIllness = false,
            surgeryOrIllnessDetails = '',
            chronicIllnesses = '',
            tattooPiercingAcupuncture = '',
            alcoholConsumption = '',
            tobaccoUse = '',
            pregnancyStatus = '',
            date = new Date()
        } = data;

        if (!donatedLast90Days) {
            errors.push('Donation status for the last 90 days is required.');
        } else if (donatedLast90Days === true) {
            errors.push("You can't donate since you have already donated in the last 90 days.");
        }

        if (!weight) {
            errors.push('Weight is required.');
        } else if (isNaN(Number(weight)) || Number(weight) < 50) {
            errors.push("You can't donate since you do not have sufficient weight.");
        }

        if (seriousConditions.length > 0) {
            concerns.seriousConditions = [...seriousConditions];
        }

        if (majorSurgeryOrIllness === 'true') {
            concerns.majorSurgeryOrIllness = surgeryOrIllnessDetails;
        }

        if (chronicIllnesses === 'true') {
            concerns.chronicIllnesses = true;
        }

        if (tattooPiercingAcupuncture === 'true') {
            errors.push('You can\'t donate blood since you have had tattoos, piercings, or acupuncture recently.');
        }

        if (alcoholConsumption === 'true') {
            errors.push('You can\'t donate blood since you have consumed alcohol in the last 48 hours.');
        }

        if (tobaccoUse == 'true') {
            concerns.tobaco_use = true;
        }

        if (pregnancyStatus == "true") {
            errors.push('You can\'t donate blood if you are pregnant.');
        }

        return {
            errors,
            concerns,
        } as BloodDonationValidationResult;
    }



    async showIntrest(auth_token: string, profile_id: string, donor_id: string, request_id: string, concerns: BloodDonationConcerns, date: Date): Promise<HelperFunctionResponse> {

        const findRequirement = await this.bloodReqRepo.findBloodRequirementByBloodId(request_id);
        const findExistance = await this.bloodDonationRepo.findExistanceOfDonation(donor_id, request_id);
        if (findExistance) {
            return {
                status: false,
                msg: "You have already showed intrest for this donation",
                statusCode: StatusCode.BAD_REQUEST,
            }
        }




        if (findRequirement) {
            const findDonor = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
            if (findDonor?.status == BloodDonorStatus.Open) {
                if (findRequirement.neededAt < date) {
                    return {
                        status: false,
                        msg: "The selected date is beyond the expected range.",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }

                const bloodDonationData: IBloodDonateTemplate = {
                    concerns,
                    date: new Date(),
                    meet_expect: date,
                    donation_id: request_id,
                    donor_id,
                    status: BloodDonationStatus.Pending
                };

                let concernsMessage: string[] = [];

                if (concerns.seriousConditions.length) {
                    concernsMessage.push(`I have serious conditions such as ${concerns.seriousConditions.join(", ")}`);
                }

                if (concerns.majorSurgeryOrIllness) {
                    concernsMessage.push(`I had major surgery on ${concerns.majorSurgeryOrIllness}`);
                }

                if (concerns.tobaco_use) {
                    concernsMessage.push(`I use tobacco`);
                }

                if (concerns.chronicIllnesses) {
                    concernsMessage.push(`I have chronic illnesses like diabetes or hypertension`);
                }

                const concernsChat = concernsMessage.length
                    ? `Please consider that I have the following concerns: ${concernsMessage.join(", ")}.`
                    : '';

                const msg = `Hi ${findRequirement.patientName}, ${concernsChat} I would like to donate my blood to you. I'll come to ${findRequirement.locatedAt.hospital_name} by ${date}.Please let me know if there’s anything else I should be aware of.`;

                console.log(`To profile id ${findRequirement.profile_id}`)
                const newInterest = await this.bloodDonationRepo.saveDonation(bloodDonationData);

                console.log(newInterest);


                if (newInterest) {


                    const bloodNotification: IChatNotification = {
                        msg,
                        subject: `${findDonor.full_name} ready to donate blood for ${findRequirement.patientName}`,
                        email_id: findRequirement.email_id,
                        from_name: findDonor.full_name,
                        reciver_name: findRequirement.patientName
                    }

                    const profileCommunication = new ProfileChat();
                    const communicationProvide = new BloodNotificationProvider(process.env.PROFILE_CHAT_UPDATE || "");
                    profileCommunication.createChatRoom(msg, findRequirement.profile_id, auth_token);
                    await communicationProvide._init_()
                    communicationProvide.transferData(bloodNotification);


                    return {
                        status: true,
                        msg: "You have showed intrested on this request",
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        status: false,
                        msg: "You've already shown interest in this.",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }
            } else if (findDonor?.status == BloodDonorStatus.Blocked) {
                const blockedReason = findDonor.blocked_reason ?? DonorAccountBlockedReason.AlreadyDonated
                return {
                    status: true,
                    msg: blockedReason,
                    statusCode: StatusCode.BAD_REQUEST
                }
            } else {
                return {
                    status: false,
                    msg: DonorAccountBlockedReason.AccountDeleted,
                    statusCode: StatusCode.UNAUTHORIZED
                }
            }
        } else {
            return {
                status: false,
                msg: "The patient no longer needs blood. Thank you.",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }


    async findActivePaginatedBloodRequirements(page: number, limit: number): Promise<HelperFunctionResponse> {
        const findReq = await this.bloodReqRepo.findActiveBloodReqPaginted(limit, (page - 1) * limit);
        if (findReq.length) {
            return {
                status: true,
                msg: "Request fetched",
                statusCode: StatusCode.OK,
                data: {
                    profile: findReq
                }
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async findRequest(profile_id: string, blood_id: string, page: number, limit: number, status?: BloodDonationStatus): Promise<HelperFunctionResponse> {
        const bloodReq = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);

        if (bloodReq && bloodReq.profile_id == profile_id) {
            const skip: number = (page - 1) * limit;
            const request = await this.bloodDonationRepo.findBloodResponse(blood_id, skip, limit, status);
            if (request.total_records) {
                return {
                    status: true,
                    msg: "Request fetched",
                    statusCode: StatusCode.OK,
                    data: request
                }
            } else {
                return {
                    status: false,
                    msg: "No data found",
                    statusCode: StatusCode.NOT_FOUND,
                }
            }
        } else {
            return {
                status: false,
                msg: "Unauthorized access.",
                statusCode: StatusCode.UNAUTHORIZED
            }
        }
    }


    // async donateBlood(donor_id: string, donation_id: string, status: BloodDonationStatus): Promise<HelperFunctionResponse> {
    //     const insertRequest: IBloodDonateTemplate = {
    //         date: new Date(),
    //         donation_id,
    //         status,
    //         donor_id
    //     }
    //     const findDonor = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
    //     if (findDonor) {
    //         if (findDonor.status == BloodDonorStatus.Blocked || findDonor.status == BloodDonorStatus.Deleted) {
    //             return {
    //                 msg: "You cannot process this request as your account is blocked for 90 days.",
    //                 status: false,
    //                 statusCode: StatusCode.BAD_REQUEST
    //             }
    //         } else {
    //             const saveData = await this.bloodDonationRepo.saveDonation(insertRequest);

    //             if (saveData) {
    //                 if (status == BloodDonationStatus.Approved) {
    //                     const blockDonor = await this.bloodDonorRepo.blockDonor(donor_id, DonorAccountBlockedReason.AlreadyDonated)
    //                     return {
    //                         msg: "Please go through the email; you will receive the remaining details",
    //                         status: true,
    //                         statusCode: StatusCode.OK
    //                     }
    //                 } else {
    //                     return {
    //                         msg: "Rejected success",
    //                         status: true,
    //                         statusCode: StatusCode.OK
    //                     }
    //                 }
    //             } else {
    //                 return {
    //                     msg: "Internal server error",
    //                     status: false,
    //                     statusCode: StatusCode.SERVER_ERROR
    //                 }
    //             }

    //         }
    //     } else {
    //         return {
    //             msg: "We couldn't find the donor",
    //             status: false,
    //             statusCode: StatusCode.UNAUTHORIZED
    //         }
    //     }
    // }

    async findBloodAvailability(status: BloodDonorStatus, blood_group?: BloodGroup): Promise<HelperFunctionResponse> {
        const findBloodAvailabilityFilter: ISearchBloodDonorTemplate = {}
        let result: IBloodAvailabilityResult = {
            [BloodGroup.A_POSITIVE]: 0,
            [BloodGroup.A_NEGATIVE]: 0,
            [BloodGroup.B_POSITIVE]: 0,
            [BloodGroup.B_NEGATIVE]: 0,
            [BloodGroup.AB_POSITIVE]: 0,
            [BloodGroup.AB_NEGATIVE]: 0,
            [BloodGroup.O_POSITIVE]: 0,
            [BloodGroup.O_NEGATIVE]: 0,
        }
        if (status) {
            findBloodAvailabilityFilter.status = status
        }
        if (blood_group) {
            findBloodAvailabilityFilter.blood_group = blood_group
        }
        const findDonors = await this.bloodDonorRepo.findDonors(findBloodAvailabilityFilter);
        console.log("Donors");

        console.log(findDonors);


        if (findDonors.length) {

            for (let index = 0; index < findDonors.length; index++) {
                if (result[findDonors[index].blood_group] != null) {
                    result[findDonors[index].blood_group]++
                } else {
                    result[findDonors[index].blood_group] = 0
                }
            }

            return {
                status: true,
                msg: "Data fetched success",
                statusCode: StatusCode.OK,
                data: result
            }
        } else {
            return {
                status: false,
                msg: "No donors found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }

    async updateBloodGroup(request_id: ObjectId, newStatus: BloodGroupUpdateStatus): Promise<HelperFunctionResponse> {
        const findBloodGroup = await this.bloodGroupUpdateRepo.findRequestById(request_id);
        if (findBloodGroup) {
            const updateData: IEditableGroupGroupRequest = {};

            if (findBloodGroup.status == BloodGroupUpdateStatus.Pending && newStatus == BloodGroupUpdateStatus.Completed) {
                updateData.new_group = findBloodGroup.new_group;
                updateData.status = BloodGroupUpdateStatus.Completed
            } else if (findBloodGroup.status == BloodGroupUpdateStatus.Pending && newStatus == BloodGroupUpdateStatus.Rejected) {
                updateData.status = BloodGroupUpdateStatus.Rejected
            } else {
                return {
                    msg: "Blood group update is not allowed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }

            const upateBloodGroup = await this.bloodGroupUpdateRepo.updateRequest(request_id, updateData)
            if (upateBloodGroup) {
                return {
                    msg: "Blood group updated success",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Blood group updated failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Blood group not found.",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async findBloodGroupChangeRequets(status: BloodGroupUpdateStatus, page: number, limit: number): Promise<HelperFunctionResponse> {
        const skip: number = (page - 1) * limit
        const findRequests = await this.bloodGroupUpdateRepo.findAllRequest(status, skip, limit)
        if (findRequests.paginated.length) {
            return {
                status: true,
                msg: "Data fetched",
                data: findRequests,
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No request found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async updateBloodGroupRequest(newGroup: BloodGroup, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse> {
        const findBloodId: IBloodDonor | null = await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
        console.log(findBloodId);

        if (findBloodId) {
            if (findBloodId.blood_group != newGroup) {
                const data: IBloodGroupUpdateTemplate = {
                    certificate: certificate_name,
                    date: new Date(),
                    donor_id: profile_id,
                    new_group: newGroup,
                    status: BloodGroupUpdateStatus.Pending
                }
                const saveData: ObjectId | null = await this.bloodGroupUpdateRepo.saveRequest(data)
                console.log(saveData);
                console.log("Saved data");


                if (saveData) {
                    return {
                        msg: "Update request has been sent",
                        status: true,
                        statusCode: StatusCode.CREATED
                    }
                } else {
                    return {
                        msg: "The update request failed",
                        status: false,
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }
            } else {
                return {
                    msg: "The new blood group is the same as the current blood group.",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "We couldn't find the blood profile.",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async updateBloodDonors(editData: Record<string, any>, edit_id: string): Promise<HelperFunctionResponse> {
        const updateDonor = await this.bloodDonorRepo.updateBloodDonor(editData, edit_id);
        console.log(updateDonor);
        console.log(edit_id, editData);


        if (updateDonor) {
            return {
                status: true,
                msg: "Donor updated success",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "Donor updation failed",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async createDonorId(blood_group: BloodGroup, fullName: string): Promise<string> {
        let blood_id: string = fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5) + blood_group;
        let isDonorExist: IBloodDonor | null = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        while (isDonorExist) {
            blood_id = blood_group + fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5);
            isDonorExist = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        }
        return blood_id
    }


    async createBloodId(blood_group: BloodGroup, unit: number): Promise<string> {
        let blood_id: string = blood_group + unit + this.utilHelper.createRandomText(5);
        let isUserExist: IBloodRequirement | null = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        while (isUserExist) {
            blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
            isUserExist = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        }
        return blood_id
    }


    async createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: ExtendsRelationship, locatedAt: LocatedAt, address: string, phoneNumber: number, email_address: string): Promise<HelperFunctionResponse> {
        const blood_id: string = await this.createBloodId(blood_group, unit)

        const createdBloodRequest: mongoObjectId | null = await this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, false, email_address)


        const matchedProfile = await this.bloodDonorRepo.findDonors({ status: BloodDonorStatus.Open, blood_group: blood_group });
        const profileEmails = matchedProfile.map((pro) => { return { name: pro.full_name, email: pro.email_address } })

        console.log("Passed two");
        const notificationQueue: string = process.env.BLOOD_REQUEST_NOTIFICATION + "";
        const notificationService = new BloodNotificationProvider(notificationQueue)
        console.log("Passed three");
        await notificationService._init_();
        notificationService.sendBloodRequest(profileEmails, blood_group, neededAt, locatedAt.hospital_name)
        console.log("Passed four");

        if (createdBloodRequest) {
            return {
                msg: "Blood requirement created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    blood_id: blood_id,
                    id: createdBloodRequest
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }

    async bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: ILocatedAt): Promise<HelperFunctionResponse> {

        const BloodDonorId: string = await this.createDonorId(bloodGroup, fullName);
        const saveData: IBloodDonorTemplate = {
            blood_group: bloodGroup,
            donor_id: BloodDonorId,
            email_address: emailID,
            full_name: fullName,
            locatedAt: location,
            phoneNumber: phoneNumber,
            status: BloodDonorStatus.Open
        };


        console.log("Saved data");
        console.log(saveData);



        const saveDonorIntoDb: ObjectId | null = await this.bloodDonorRepo.createDonor(saveData);
        console.log("Save donor db");

        console.log(saveDonorIntoDb);

        if (saveDonorIntoDb) {
            // const updateUser = await this.
            const tokenHelper = new TokenHelper();
            const authToken = await tokenHelper.generateJWtToken({ blood_group: bloodGroup, donor_id: BloodDonorId, email_address: emailID, full_name: fullName, phone_number: phoneNumber }, JwtTimer._30Days)
            console.log("Proifle");
            console.log(authToken);


            return {
                msg: "Blood profile created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    donor_db_id: saveDonorIntoDb,
                    donor_id: BloodDonorId,
                    token: authToken
                }
            }
        } else {
            return {
                msg: "Blood profile creation failed",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async closeRequest(blood_id: string, category: BloodCloseCategory, explanation: string): Promise<HelperFunctionResponse> {
        const bloodRequestion = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        if (bloodRequestion) {
            const updateData: boolean = await this.bloodReqRepo.updateBloodDonor(blood_id, {
                is_closed: true,
                status: BloodStatus.Closed,
                close_details: {
                    category,
                    explanation
                }
            });
            if (updateData) {
                return {
                    msg: "Requirement closed",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Requirement closing failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }



}


export default BloodService