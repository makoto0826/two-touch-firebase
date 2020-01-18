import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, FirestoreDocumentNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS } from '../constants';
import { checkApiKey } from '../utils';
import { VersionData } from '../model';

const firestore = admin.firestore();

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

            const versionDoc = await firestore.collection(FirestoreCollectionNames.INFORMATION)
                .doc(FirestoreDocumentNames.VERSION)
                .get()

            const version = versionDoc.data() as VersionData;

            res.send({
                version: {
                    usersVersion: version.usersVersion
                }
            });

        } catch (ex) {
            console.error(ex);
            res.status(500).send({ message: 'internal server error' });
        }
    });
