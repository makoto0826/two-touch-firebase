import { AdditionalField } from "./additionalField";

export type ListEmployeesRequest = {
    date: string | null,
    division: string | null,
    additionalFields: AdditionalField | null
}