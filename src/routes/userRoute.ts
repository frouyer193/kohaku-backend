import { NextFunction, Request, Response, Router } from 'express';

export class UserRoutes {

    public static create(router: Router) {

        router.get('/user', (req: Request, res: Response, next: NextFunction) => {
            res.send('Hello user !');
        });

    }

}
