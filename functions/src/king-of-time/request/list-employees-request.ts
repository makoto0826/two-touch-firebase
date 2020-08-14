import { AdditionalField } from './additional-field';

export type ListEmployeesRequest = {
    date: string | null,
    division: string | null,
    additionalFields: AdditionalField | null
}