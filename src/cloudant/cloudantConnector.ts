import * as cloudant from '@cloudant/cloudant';
import * as fs from 'fs';
import { ICloudantCredential } from '../models/iCloudantCredential';
import { IUser } from '../models/iUser';

export class CloudantConnector {

    public static getInstance(): CloudantConnector {
        return this.instance || (this.instance = new this());
    }

    private static readonly DB_NAME = 'dataviz';
    private static instance: CloudantConnector;

    public database: cloudant.DocumentScope<any>;
    private dbCredentials: ICloudantCredential;
    private cloudant: cloudant.ServerScope;

    private constructor() { this.initDBConnection(); }

    private initDBConnection() {

        // When running on Bluemix, this variable will be set to a json object
        // containing all the service credentials of all the bound services
        if (process.env.VCAP_SERVICES) {
            this.dbCredentials = this.getDBCredentials(process.env.VCAP_SERVICES);
        } else { // When running locally, the VCAP_SERVICES will not be set

            // When running this app locally you can get your Cloudant credentials
            // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
            // Variables section for an app in the Bluemix console dashboard).
            // Once you have the credentials, paste them into a file called vcap-local.json.
            // Alternately you could point to a local database here instead of a
            // Bluemix service.
            // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
            this.dbCredentials = this.getDBCredentials(fs.readFileSync('src/cloudant/vcap-local.json', 'utf-8'));
        }

        this.cloudant = cloudant({
            account: this.dbCredentials.username,
            password: this.dbCredentials.password,
        }) as cloudant.ServerScope;

        // check if DB exists if not create
        this.cloudant.db.create(CloudantConnector.DB_NAME, (err: any, res: any) => {
            if (err) {
                console.log('Could not create new db, it might already exist.');
            }
        });
        this.database = this.cloudant.use(CloudantConnector.DB_NAME);
    }

    private getDBCredentials(jsonData: string): ICloudantCredential {
        const vcapServices = JSON.parse(jsonData);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (const vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                return vcapServices[vcapService][0].credentials;
            }
        }
    }
}
