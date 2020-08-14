import { TimeRecordType } from '../../king-of-time/model';

export type AddTimeRecordRequest = {
    localTimeRecordId: string
    userId: string
    userName: string
    card: string
    type: TimeRecordType,
    registeredAt: string 
}