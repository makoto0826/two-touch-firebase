import * as admin from 'firebase-admin';
import { FirestoreCollectionNames } from './constants';

const firestore = admin.firestore()

/**
 * 
 * @param apiKey 
 */
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

    const doc = snapshot.docs[0];
    return doc.data().apiKey === apiKey;
}