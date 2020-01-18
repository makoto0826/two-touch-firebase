
export abstract class ApiResult {

    protected _json: any;

    get json() {
        return this._json;
    }

    protected _ok: boolean;

    get ok() {
        return this._ok;
    }

    constructor(json: any) {
        this._json = json;
        this._ok = true;
    }
}