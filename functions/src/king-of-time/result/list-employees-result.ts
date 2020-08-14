import { ApiResult } from './api-result';
import { Employee } from '../model';

export class ListEmployeesResult extends ApiResult {
    get values() {
        return this.json as Employee[];
    }

    constructor(json: any) {
        super(json);
    }
}