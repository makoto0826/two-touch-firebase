
export enum TimeRecordType {
    IN = '1',
    OUT = '2',
    GO_OUT_IN = '7',
    GO_OUT_OUT = '8'
}

export enum AddTimeRecordStatus {
    OK = '1',
    USER_NOT_FOUND = '5'
}

export type AddTimeRecordRequest = {
    localTimeRecordId?: string
    userId?: string
    userName?: string
    cardId?: string
    type?: TimeRecordType,
    registeredAt?: Date
}