
export class KingOfTimeApiOptions {
    readonly baseUrl: string = 'https://api.kingtime.jp/v1.0';

    constructor(readonly token: string) {
        if(token == null) {
            throw new Error('token is null');
        }
    }
}