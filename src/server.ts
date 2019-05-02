
import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';

import { CloudantConnector } from './cloudant/cloudantConnector';
import { IndexRoutes } from './routes/indexRoute';
import { UserRoutes } from './routes/userRoute';
import { ImportCSVtoCloudant } from './utils/importCSVtoCloudant';

export class Server {

    public static bootstrap(): Server {
        return new Server();
    }

    public app: express.Application;

    constructor() {
        this.app = express();
        this.routes();
        this.config();

    }

    private routes() {
        let router: express.Router;
        router = express.Router();

        UserRoutes.create(router);
        IndexRoutes.create(router);

        this.app.use(router);
    }

    private config() {
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());

        this.app.set('port', process.env.PORT || 3000);
        // development only
        if ('development' === this.app.get('env')) {
            this.app.use(errorHandler());
        }
    }

}
