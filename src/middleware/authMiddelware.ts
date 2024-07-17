import { Request, Response, NextFunction } from 'express'

interface IAuthMiddleware {
    isValidUser(req: Request, res: Response, next: NextFunction)
}

class AuthMiddleware implements IAuthMiddleware {

    isValidUser(req: Request, res: Response, next: NextFunction) {
        next()
    }

}

export default AuthMiddleware