import { KingOfTimeApiOptions } from "./kingOfTimeApiOptions";
import { AddDailyTimeRecordRequest, ListEmployeesRequest } from "./request";
import { ErrorResult, ListEmployeesResult, AddDailyTimeRecordResult } from "./result";
const fetch = require('node-fetch');

const ADD_DAILY_TIME_CARD_BODY = ['date', 'time', 'code'];

const getDefaultHeaders = (token: string) => {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
    }
}

const createQuery = (value: any) => {
    const ADDITIONAL_FIELDS = 'additionalFields'
    let query = '';

    for (const key of Object.keys(value)) {
        if (key === ADDITIONAL_FIELDS) {
            query += `${ADDITIONAL_FIELDS}=${value[key]}&`;
        } else {
            query += `${key}=${value[key]}&`;
        }
    }

    return query;
}

export class KingOfTimeApi {
    private readonly _options: KingOfTimeApiOptions;

    constructor(options: KingOfTimeApiOptions) {
        this._options = options;
    }

    async listEmployees(request: ListEmployeesRequest) {
        let url = `${this._options.baseUrl}/employees`;
        const query = createQuery(request);

        if (query.length !== 0) {
            url += `?${query}`;
        }

        const headers = getDefaultHeaders(this._options.token);

        const options = {
            'method': 'GET',
            'headers': headers
        };

        const response = await fetch(url, options);
        const json = await response.json();

        if (response.status === 200) {
            return new ListEmployeesResult(json);
        }

        return new ErrorResult(json);
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
