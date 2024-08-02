
import { Request } from 'express';
import url from 'url'

interface IUtilHelper {

    createRandomText(length: number): string
    extractImageNameFromPresignedUrl(presigned_url: string): string | boolean
    getTokenFromHeader(headers: Request['headers']['authorization']): string | false
}

class UtilHelper implements IUtilHelper {


    getTokenFromHeader(headers: Request['headers']['authorization']): string | false {
        const splitAuth = headers?.split(" ");
        if (splitAuth && splitAuth[0] == "Bearer") {
            const token: string | undefined = splitAuth[1];
            if (token) {
                return token
            }
        }
        return false
    }

    createRandomText(length: number): string {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let word = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            word += letters[randomIndex];
        }
        return word.toUpperCase();
    }


    extractImageNameFromPresignedUrl(presigned_url: string): string | false {
        const newUrl = url.parse(presigned_url, true)
        const urlPath = newUrl.pathname;
        const splitPath = urlPath?.split("/");
        if (splitPath && splitPath?.length >= 2) {
            const imageName = splitPath[2];
            return imageName
        }
        return false
    }
}


export default UtilHelper