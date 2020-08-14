import { Gender } from './gender';

export type Employee = {
    divisionCode: string
    divisionName: string
    gender: Gender
    typeCode: string
    typeName: string
    code: string
    key: string
    lastName: string
    firstName: string
    lastNamePhonetics?: string
    firstNamePhonetics?: string
    hiredDate?: string
    birthDate?: string
    resignationDate?: string
    emailAddresses?: string[]
    allDayRegardingWorkInMinute?: string
}