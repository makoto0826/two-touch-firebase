import { TimeRecordType } from "../../king-of-time/model";

export type AddTimeRecordRequest = {
    localTimeRecordId: string
    userId: string
    userName: string
    cardId: string
    type: TimeRecordType,
    registeredAt: string 
}