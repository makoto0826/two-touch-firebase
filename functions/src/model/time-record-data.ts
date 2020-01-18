import { TimeRecordStatus } from "./time-record-status"
import { TimeRecordType } from "../king-of-time/model"

export type TimeRecordData = {
    localTimeRecordId: string
    cardId: string
    userId: string
    userName: string
    type: TimeRecordType
    status: TimeRecordStatus
    registeredAt: string
    kingOfTimeId: string
    createdAt: FirebaseFirestore.Timestamp
    updatedAt: FirebaseFirestore.Timestamp
}