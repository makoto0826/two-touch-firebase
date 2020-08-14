import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, FirestoreDocumentNames } from './constants';
import { DeviceData, KingOfTimeData, Device } from './model';

const firestore = admin.firestore()

export async function getDeviceByApiKey(apiKey: string) {
    if (!apiKey) {
        return null;
    }

    const snapshot = await firestore.collection(FirestoreCollectionNames.DEVICES)
        .where('apiKey', '==', apiKey)
        .get()

    if (snapshot.empty) {
        return null;
    }

    const deviceDoc = snapshot.docs[0];

    return new Device(
        deviceDoc.id,
        deviceDoc.data() as DeviceData
    ) as Readonly<Device>;
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