import { Request, Response } from 'express';

interface IUserController {
    blood_request(req: Request, res: Response)
}

class UserController implements IUserController {

    blood_request(req: Request, res: Response) {

    }

}

export default UserController