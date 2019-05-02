import * as parse from 'csv-parse';
import * as fs from 'fs';
import * as R from 'ramda';

import { CloudantConnector } from '../cloudant/cloudantConnector';

export class ImportCSVtoCloudant {

    private static PATH = 'data/ATA_Concour_DataViz';

    constructor() {
        const listDir = fs.readdirSync(ImportCSVtoCloudant.PATH, { encoding: 'utf-8' }) as string[];
        this.convertToJson(listDir);
    }

    private async convertToJson(filenames: string[]) {
        const jsonData: object[] = [];
        for (const filename of filenames) {
            const csv = fs.readFileSync(ImportCSVtoCloudant.PATH + '/' + filename, { encoding: 'utf-8' });
            const parsedData = await this.parseCSVtoJsonArray(csv);
            await this.uploadObjectToCloudant(R.flatten(parsedData));
        }
    }

    private parseCSVtoJsonArray(csv: string): Promise<object[]> {
        return new Promise((resolve: any, reject: any) => {
            parse(csv, { columns: true, delimiter: ';' }, (err: any, data: object[]) => {
                if (err) { reject(err); }
                resolve(data);
            });
        });

    }

    private async uploadObjectToCloudant(data: object[]): Promise<any> {
        return new Promise((resolve, reject) => {
            CloudantConnector.getInstance().database.bulk({ docs: data }, (err: any, res: any) => {
                if (err) { reject(err); }
                resolve(res);
            });
        });
    }
}
