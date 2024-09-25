import mongoose, { ObjectId } from "mongoose";
import { BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodGroupUpdateStatus, BloodStatus, JwtTimer, Relationship, S3BucketsNames, S3FolderName, StatusCode } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { IBloodAvailabilityResult, LocatedAt, mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodReqRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import IBloodRequirement, { IBloodDonateTemplate, IBloodDonor, IBloodDonorTemplate, IBloodGroupUpdateTemplate, IBloodRequirementTemplate, IEditableBloodRequirementTemplate, IEditableGroupGroupRequest, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorRepo from "../repo/bloodDonorRepo";
import BloodGroupUpdateRepo from "../repo/bloodGroupUpdate";
import BloodDonationRepo from "../repo/bloodDonation";
import TokenHelper from "../Util/Helpers/tokenHelper";
import S3BucketHelper from "../Util/Helpers/S3Helper";

interface IImageServices {
    generatePresignedUrlForChangeBloodGroupCertificat(): Promise<HelperFunctionResponse>
}

class ImageServices implements IImageServices {


    private readonly utilHelper: UtilHelper;
    private readonly s3Bucket;

    constructor() {
        this.utilHelper = new UtilHelper();
        this.s3Bucket = new S3BucketHelper(S3BucketsNames.bloodCertificate, S3FolderName.bloodCertification)
    }


    async generatePresignedUrlForChangeBloodGroupCertificat(): Promise<HelperFunctionResponse> {
        const certificate_name = `certificate_${this.utilHelper.createRandomText(5)}${new Date().getMilliseconds()}.jpeg`
        const presignedUrl = await this.s3Bucket.generatePresignedUrl(certificate_name);
        if (presignedUrl) {
            return {
                status: true,
                statusCode: StatusCode.CREATED,
                msg: "Presigned url has been created",
                data: {
                    certificate_upload_url: presignedUrl
                }
            }
        } else {
            return {
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
                msg: "Something went wrong"
            }
        }
    }





}


export default ImageServices