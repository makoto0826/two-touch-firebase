import { ApiResult } from "./api-result";

export class ErrorResult extends ApiResult {
    constructor(json: any) {
        super(json);
        this._ok = false;
    }
}