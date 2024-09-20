
import { Request } from 'express';
import url from 'url'

interface IUtilHelper {

    createRandomText(length: number): string
    extractImageNameFromPresignedUrl(presigned_url: string): string | boolean
    getTokenFromHeader(headers: Request['headers']['authorization']): string | false
    getBloodTokenFromHeader(headers: Request['headers']['authorization']): string | false
    generateAnOTP(length: number): number
}

class UtilHelper implements IUtilHelper {

    generateAnOTP(length: number): number {
        const min: number = Math.pow(10, length - 1);
        const max: number = Math.pow(10, length) - 1;
        const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    getBloodTokenFromHeader(headers: Request['headers']['authorization']): string | false {
        console.log(headers);

        if (headers && typeof headers == "string") {
            const splitAuth = headers.split(" ");
            if (splitAuth && splitAuth[0] == "Bearer") {
                const token: string | undefined = splitAuth[1];
                if (token) {
                    return token
                }
            }
        }
        return false
    }

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
        console.log(urlPath);

        if (splitPath && splitPath?.length >= 2) {
            const imageName = `${splitPath[1]}/${splitPath[2]}`;
            return imageName
        }
        return false
    }

    formatDateToMonthNameAndDate(date: Date): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const d = new Date(date);
        const monthName = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        return `${monthName} ${day} ${year} `;
    }
}


export default UtilHelper