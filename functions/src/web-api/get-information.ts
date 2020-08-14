import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, FirestoreDocumentNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS, DEFAULT_ERROR_RESPONSE } from '../constants';
import { getDeviceByApiKey } from '../utils';
import { VersionData } from '../model';

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
            res.status(500).send(DEFAULT_ERROR_RESPONSE.InternalServerError);
        }
    });
