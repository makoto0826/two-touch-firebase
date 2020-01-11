import * as admin from 'firebase-admin';
import { FirestoreCollectionNames } from '../constants';
import { DeviceData } from '../model';

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