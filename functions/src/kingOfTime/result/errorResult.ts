import { ApiResult } from "./apiResult";

export class ErrorResult extends ApiResult {
    constructor(json: any) {
        super(json);
        this._ok = false;
    }
}