import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, FirestoreDocumentNames } from './constants';
import { DeviceData, KingOfTimeData } from './model';

const firestore = admin.firestore()

export async function checkApiKey(apiKey: string) {
    if (!apiKey) {
        return false;
    }

    const snapshot = await firestore.collection(FirestoreCollectionNames.DEVICES)
        .where('apiKey', '==', apiKey)
        .get()

    if (snapshot.empty) {
        return false;
    }

    const device = snapshot.docs[0].data() as DeviceData;
    return device.apiKey === apiKey;
}

export async function getKingOfTimeData() {
    const kingOfTimeSnapshot = await firestore.collection(FirestoreCollectionNames.INFORMATION)
        .doc(FirestoreDocumentNames.KING_OF_TIME)
        .get();

    if (!kingOfTimeSnapshot.exists) {
        throw new Error('king of time toekn not found');
    }

    return kingOfTimeSnapshot.data() as KingOfTimeData
}