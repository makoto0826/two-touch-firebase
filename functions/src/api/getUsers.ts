import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS } from '../constants';
import { checkApiKey } from './utils';

const firestore = admin.firestore();

/**
 * 
 */
export default functions
    .region(TOKYO_REGION)
    .runWith(RUNTIME_OPTIONS)
    .https.onRequest(async (req, res) => {
        const apiKey = req.header(X_API_KEY) as string;

        try {
            if (!await checkApiKey(apiKey)) {
                res.status(401).send({ message: 'unauthorized' });
                return;
            }

            const snapshot = await firestore.collection(FirestoreCollectionNames.USERS).get()
            const results = [];

            for (const doc of snapshot.docs) {
                const data = doc.data();

                results.push({
                    userId: data.userId,
                    userName: data.userName,
                    cards: data.cards
                });
            }

            res.send(results);
        } catch (ex) {
            console.error(ex);
            res.status(500).send({ message: 'internal server error' });
        }
    });