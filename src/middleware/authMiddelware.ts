import { Request, Response, NextFunction } from 'express'

interface IAuthMiddleware {
    isValidUser(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidDonor(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidReq(req: Request, res: Response, next: NextFunction): Promise<void>
    isValidAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
}

class AuthMiddleware implements IAuthMiddleware {

    async isValidAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        next()
    }

    async isValidUser(req: Request, res: Response, next: NextFunction) {
        next()
    }

    async isValidDonor(req: Request, res: Response, next: NextFunction) {
        next()
    }

    async isValidReq(req: Request, res: Response, next: NextFunction) {
        next()
    }
}

export default AuthMiddleware