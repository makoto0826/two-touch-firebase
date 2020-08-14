import { TimeRecordType } from '../model';

export type AddDailyTimeRecordRequest = {
    employeeKey: string
    date: string
    time: string
    code: TimeRecordType
}