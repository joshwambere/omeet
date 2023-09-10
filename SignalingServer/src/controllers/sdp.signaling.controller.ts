import { NextFunction, Request, Response } from 'express';

class SDPSignalingController {
    public index(req: Request, res: Response, next: NextFunction): void {
        res.send('Hello World');
    }
}


export default SDPSignalingController;
