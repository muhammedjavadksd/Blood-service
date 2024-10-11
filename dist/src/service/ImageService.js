"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UtilHelpers_1 = __importDefault(require("../Util/Helpers/UtilHelpers"));
const S3Helper_1 = __importDefault(require("../Util/Helpers/S3Helper"));
const Enum_1 = require("../Util/Types/Enum");
class ImageServices {
    constructor() {
        this.utilHelper = new UtilHelpers_1.default();
        this.s3Bucket = new S3Helper_1.default(Enum_1.S3BucketsNames.bloodCertificate, Enum_1.S3FolderName.bloodCertification);
    }
    generatePresignedUrlForChangeBloodGroupCertificat() {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate_name = `certificate_${this.utilHelper.createRandomText(5)}${new Date().getMilliseconds()}.jpeg`;
            const presignedUrl = yield this.s3Bucket.generatePresignedUrl(certificate_name);
            if (presignedUrl) {
                return {
                    status: true,
                    statusCode: Enum_1.StatusCode.CREATED,
                    msg: "Presigned url has been created",
                    data: {
                        certificate_upload_url: presignedUrl
                    }
                };
            }
            else {
                return {
                    status: false,
                    statusCode: Enum_1.StatusCode.SERVER_ERROR,
                    msg: "Something went wrong"
                };
            }
        });
    }
}
exports.default = ImageServices;
