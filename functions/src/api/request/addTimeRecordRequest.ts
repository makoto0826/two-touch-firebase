import { TimeRecordType } from "../../kingOfTime/model";

export type AddTimeRecordRequest = {
    localTimeRecordId: string
    userId: string
    userName: string
    cardId: string
    type: TimeRecordType,
    registeredAt: string 
}