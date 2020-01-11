import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS, FirestoreDocumentNames } from '../constants';
import { AddTimeRecordRequest } from './request';
import { checkApiKey } from './utils';
import { TimeRecordStatus, KingOfTimeData, UserData, TimeRecordData } from '../model';
import { KingOfTimeApiOptions, KingOfTimeApi } from '../kingOfTime';

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const firestore = admin.firestore();

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
                .where('cards', 'array-contains', request.cardId)
                .get();

            if (userSnapshot.empty) {
                console.error('user not found', request.localTimeRecordId);
                res.status(400).send({ message: 'user not found' });
                return;
            }

            const userData = userSnapshot.docs[0].data() as UserData;
            let status = TimeRecordStatus.OK;

            await firestore.runTransaction(async (tx) => {
                const timeRecordRef = firestore.collection(FirestoreCollectionNames.TIME_RECORDS).doc();

                const timeRecordSnapshot = await firestore.collection(FirestoreCollectionNames.TIME_RECORDS)
                    .where('localTimeRecordId', '==', request.localTimeRecordId)
                    .get();

                if (!timeRecordSnapshot.empty) {
                    console.error('duplicate localTimeRecordId', request.localTimeRecordId);
                    res.status(400).send({ message: 'duplicate localTimeRecordId' });
                    return;
                }

                const snapshot = await firestore.collection(FirestoreCollectionNames.INFORMATION)
                    .doc(FirestoreDocumentNames.KING_OF_TIME)
                    .get();

                const kingOfTimeData = snapshot.data() as KingOfTimeData;
                const api = new KingOfTimeApi(new KingOfTimeApiOptions(kingOfTimeData.token));

                const registerdAt = moment(request.registeredAt);

                const addDailyTimeRecordRequest = {
                    employeeKey: userData.kingOfTimeId,
                    date: registerdAt.format('YYYY-MM-DD'),
                    time: registerdAt.format('YYYY-MM-DDTHH:mm:Z'),
                    code: request.type
                };

                console.log(addDailyTimeRecordRequest);

                const result = await api.addDailyTimeRecord(addDailyTimeRecordRequest);

                if (!result.ok) {
                    status = TimeRecordStatus.API_ERROR;
                    console.error(result.json);
                }

                tx.create(timeRecordRef, {
                    localTimeRecordId: request.localTimeRecordId,
                    cardId: request.cardId,
                    userId: request.userId,
                    userName: request.userName,
                    type: request.type,
                    status: status,
                    registeredAt: request.registeredAt,
                    kingOfTimeId: userData.kingOfTimeId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                } as TimeRecordData);
            });

            res.send();
        } catch (ex) {
            console.error(ex);
            res.status(500).send({ message: 'internal server error' });
        }
    });
