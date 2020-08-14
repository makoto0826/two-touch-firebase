import * as functions from 'firebase-functions';

export const FirestoreCollectionNames = {
    INFORMATION: '/information',

    DEVICES: '/devices',

    USERS: '/users',

} as const

export const FirestoreDocumentNames = {
    VERSION: 'version',

    KING_OF_TIME: 'kingOfTime',

    TIME_RECORDS: 'timeRecords'
} as const

export const FirestoreSubCollectionNames = {
    TIME_RECORDS: 'timeRecords'
} as const

export const TOKYO_REGION = 'asia-northeast1';

export const X_API_KEY = 'X-API-KEY'

export const RUNTIME_OPTIONS: functions.RuntimeOptions = {
    timeoutSeconds: 540,
    memory: '1GB'
} as const

export const DEFAULT_ERROR_RESPONSE = {
    Unauthorized: {
        code: '401',
        message: 'unauthorized'
    },
    InternalServerError: {
        code: '500',
        message: 'internal server error'
    }
} as const