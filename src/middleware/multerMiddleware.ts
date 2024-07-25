
import multer from 'multer'
import { CustomRequest } from '../Util/Types/Interface/UtilInterface';

export const saveBloodRequestUpdateCertificate = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/blood_certificate')
    },
    filename: function (req: CustomRequest, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if (!req.context) {
            req.context = {}
        }
        req.context.certificate_name = uniqueSuffix;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})