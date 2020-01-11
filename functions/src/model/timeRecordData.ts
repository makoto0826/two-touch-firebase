import { TimeRecordStatus } from "./timeRecordStatus"
import { TimeRecordType } from "../kingOfTime/model"

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