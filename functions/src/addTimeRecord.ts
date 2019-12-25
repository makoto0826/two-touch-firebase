import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS } from './constants';
import { AddTimeRecordRequest, AddTimeRecordStatus } from './requests';
import { checkApiKey } from './utils';

const firestore = admin.firestore();

/**
 * 
 */
export default functions
    .region(TOKYO_REGION)
    .runWith(RUNTIME_OPTIONS)
    .https.onRequest(async (req, res) => {
        const apiKey = req.header(X_API_KEY) as string

        try {
            if (!await checkApiKey(apiKey)) {
                res.status(401).send({ message: 'unauthorized' });
                return;
            }

            const request = req.body as AddTimeRecordRequest

            const userSnapshot = await firestore.collection(FirestoreCollectionNames.USERS)
                .where('userId', '==', request.userId)
                .where("cards", "array-contains", request.cardId)
                .get();


            let status: AddTimeRecordStatus = AddTimeRecordStatus.OK;
            let kingOfTimeId: unknown = null;

            if (userSnapshot.empty) {
                status = AddTimeRecordStatus.USER_NOT_FOUND;
            } else {
                const userDoc = userSnapshot.docs[0].data();
                kingOfTimeId = userDoc.kingOfTimeId;
            }

            await firestore.runTransaction((tx) => {
                const timeRecordRef = firestore.collection(FirestoreCollectionNames.TIME_RECORDS).doc();

                tx.create(timeRecordRef, {
                    localTimeRecordId: request.localTimeRecordId,
                    cardId: request.cardId,
                    userId: request.userId,
                    userName: request.userName,
                    type: request.type,
                    status: status,
                    registeredAt: request.registeredAt,
                    kingOfTimeId: kingOfTimeId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return Promise.resolve();
            });

            res.send({ status: status });
        } catch (ex) {
            console.error(ex);
            res.status(500).send({ message: 'internal server error' });
        }
    });
