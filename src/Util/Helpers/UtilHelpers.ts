
import url from 'url'

interface IUtilHelper {

    createRandomText(length: number): string
    extractImageNameFromPresignedUrl(presigned_url: string): string | boolean
}

class UtilHelper implements IUtilHelper {

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