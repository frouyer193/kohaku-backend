import { NextFunction, Request, Response, Router } from 'express';
import { CloudantConnector } from '../cloudant/cloudantConnector';

export class IndexRoutes {

    public static create(router: Router): void {

        router.get('/', (req: Request, res: Response, next: NextFunction) => {

            CloudantConnector.getInstance().database.get('726d7b5d4cfd79573f0d1a7e83724e29', (err: any, data: any) => {
                if (err) {
                    return;
                }
                res.send(data);
            });

        });

    }

}
