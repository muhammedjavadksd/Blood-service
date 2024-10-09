import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import S3BucketHelper from "../Util/Helpers/S3Helper";
import { S3BucketsNames, S3FolderName, StatusCode } from "../Util/Types/Enum";

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