import { Request, Response, NextFunction } from 'express'

interface IAuthMiddleware {
    isValidUser(req: Request, res: Response, next: NextFunction)
    isValidDonor(req: Request, res: Response, next: NextFunction)
    isValidReq(req: Request, res: Response, next: NextFunction)
}

class AuthMiddleware implements IAuthMiddleware {

    isValidUser(req: Request, res: Response, next: NextFunction) {
        next()
    }

    isValidDonor(req: Request, res: Response, next: NextFunction) {
        next()
    }

    isValidReq(req: Request, res: Response, next: NextFunction) {
        next()
    }
}

export default AuthMiddleware