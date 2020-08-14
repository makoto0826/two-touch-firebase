import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS, DEFAULT_ERROR_RESPONSE } from '../constants';
import { getDeviceByApiKey } from '../utils';
import { UserData } from '../model';

const firestore = admin.firestore();

export default functions
    .region(TOKYO_REGION)
    .runWith(RUNTIME_OPTIONS)
    .https.onRequest(async (req, res) => {
        const apiKey = req.header(X_API_KEY) as string;

        try {
            const device = await getDeviceByApiKey(apiKey);

            if (device === null) {
                res.status(401).send(DEFAULT_ERROR_RESPONSE.Unauthorized);
                return;
            }

            const snapshot = await firestore.collection(FirestoreCollectionNames.USERS).get()
            const results: Partial<UserData>[] = [];

            for (const doc of snapshot.docs) {
                const data = doc.data() as UserData;

                results.push({
                    userId: data.userId,
                    userName: data.userName,
                    cards: data.cards
                });
            }

            res.send(results);
        } catch (ex) {
            console.error(ex);
            res.status(500).send(DEFAULT_ERROR_RESPONSE.InternalServerError);
        }
    });

