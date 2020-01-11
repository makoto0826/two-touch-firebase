import { KingOfTimeApiOptions } from "./kingOfTimeApiOptions";
import { AddDailyTimeRecordRequest } from "./request";
import { ErrorResult } from "./result";
import { AddDailyTimeRecordResult } from "./result/addDailyTimeRecordResult";

const fetch = require('node-fetch');

const getDefaultHeaders = (token: string) => {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
    }
}

const ADD_DAILY_TIME_CARD_BODY = ['date', 'time', 'code'];

export class KingOfTimeApi {
    private readonly _options: KingOfTimeApiOptions;

    constructor(options: KingOfTimeApiOptions) {
        this._options = options;
    }

    async addDailyTimeRecord(request: AddDailyTimeRecordRequest) {
        const url = `${this._options.baseUrl}/daily-workings/timerecord/${request.employeeKey}`;

        const headers = getDefaultHeaders(this._options.token);
        const body: any = {};

        for (const key of ADD_DAILY_TIME_CARD_BODY) {
            if ((request as any)[key]) {
                body[key] = (request as any)[key];
            }
        }

        const options = {
            'method': 'POST',
            'body': JSON.stringify(body),
            'headers': headers
        };

        const response = await fetch(url, options);
        const json = await response.json();

        if (response.status === 201) {
            return new AddDailyTimeRecordResult(json);
        }

        return new ErrorResult(json);
    }
}
