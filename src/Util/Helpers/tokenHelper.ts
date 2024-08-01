import jwt from "jsonwebtoken";
import { IDonorJwtInterface } from "../Types/Interface/UtilInterface";

interface ITokenHelper {
    generateJWtToken: (payload: IDonorJwtInterface, timer: string) => Promise<string | null>;
    decodeJWTToken: (jwttoken: string) => Promise<jwt.Jwt | null>;
    checkTokenValidity: (token: string) => Promise<jwt.JwtPayload | boolean | string>;
}

class TokenHelper implements ITokenHelper {

    constructor() {
        this.checkTokenValidity = this.checkTokenValidity.bind(this)
        this.decodeJWTToken = this.decodeJWTToken.bind(this)
        this.generateJWtToken = this.generateJWtToken.bind(this)
    }

    async generateJWtToken(payload: IDonorJwtInterface, timer: string): Promise<string | null> {
        try {
            const jwtToken: string = await jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: "HS256", expiresIn: timer });
            return jwtToken;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async decodeJWTToken(jwttoken: string): Promise<jwt.Jwt | null> {
        try {
            const decode: jwt.Jwt | null = await jwt.decode(jwttoken, { complete: true });
            return decode;
        } catch (e) {
            return null;
        }
    }

    async checkTokenValidity(token: string): Promise<jwt.JwtPayload | boolean | string> {
        try {
            const checkValidity: jwt.JwtPayload | string = await jwt.verify(token, process.env.JWT_SECRET!);
            return checkValidity;
        } catch (e) {
            return false;
        }
    }
}



export default TokenHelper;

