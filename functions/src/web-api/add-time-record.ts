import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirestoreCollectionNames, X_API_KEY, TOKYO_REGION, RUNTIME_OPTIONS, DEFAULT_ERROR_RESPONSE, FirestoreSubCollectionNames } from '../constants';
import { AddTimeRecordRequest } from './request';
import { getDeviceByApiKey, getKingOfTimeData } from '../utils';
import { TimeRecordStatus, UserData, TimeRecordData } from '../model';
import { KingOfTimeApiOptions, KingOfTimeApi } from '../king-of-time';

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const firestore = admin.firestore();

export default functions
    .region(TOKYO_REGION)
    .runWith(RUNTIME_OPTIONS)
    .https.onRequest(async (req, res) => {
        const apiKey = req.header(X_API_KEY) as string

        try {
            const device = await getDeviceByApiKey(apiKey);

            if (device === null) {
                res.status(401).send(DEFAULT_ERROR_RESPONSE.Unauthorized);
                return;
            }

            const request = req.body as AddTimeRecordRequest

            const userSnapshot = await firestore.collection(FirestoreCollectionNames.USERS)
                .where('userId', '==', request.userId)
                .get();

            if (userSnapshot.empty) {
                console.error('user not found', request.localTimeRecordId);
                res.status(400).send({
                    code: '400.1',
                    message: 'user not found'
                });

                return;
            }

            const userData = userSnapshot.docs[0].data() as UserData;

            await firestore.runTransaction(async (tx) => {
                const timeRecordQuery =
                    firestore.collection(FirestoreCollectionNames.DEVICES)
                        .doc(device.id)
                        .collection(FirestoreSubCollectionNames.TIME_RECORDS)
                        .where('localTimeRecordId', '==', request.localTimeRecordId);

                const timeRecordSnapshot = await tx.get(timeRecordQuery);

                if (!timeRecordSnapshot.empty) {
                    console.error('duplicate localTimeRecordId', request.localTimeRecordId);
                    res.status(400).send({
                        code: '400.2',
                        message: 'duplicate local time record id'
                    });

                    return;
                }

                const kingOfTimeData = await getKingOfTimeData();
                const api = new KingOfTimeApi(new KingOfTimeApiOptions(kingOfTimeData.token));

                const registerdAt = moment(request.registeredAt);

                const addDailyTimeRecordRequest = {
                    employeeKey: userData.kingOfTimeId,
                    date: registerdAt.format('YYYY-MM-DD'),
                    time: registerdAt.format('YYYY-MM-DDTHH:mm:00Z'),
                    code: request.type
                };

                console.log('addDailyTimeRecordRequest', addDailyTimeRecordRequest);
                const result = await api.addDailyTimeRecord(addDailyTimeRecordRequest);

                if (!result.ok) {
                    status = TimeRecordStatus.SYNC_ERROR;
                    res.status(400).send({
                        code: '400.3',
                        message: 'king of time error'
                    });

                    console.error('error json', result.json);
                    return;
                }

                const timeRecordRef =
                    firestore.collection(FirestoreCollectionNames.DEVICES)
                        .doc(device.id)
                        .collection(FirestoreSubCollectionNames.TIME_RECORDS)
                        .doc();

                tx.create(timeRecordRef, {
                    localTimeRecordId: request.localTimeRecordId,
                    card: request.card,
                    userId: request.userId,
                    userName: request.userName,
                    type: request.type,
                    status: TimeRecordStatus.SYNCED,
                    registeredAt: request.registeredAt,
                    kingOfTimeId: userData.kingOfTimeId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                } as TimeRecordData);
            });

            res.send();
        } catch (ex) {
            console.error(ex);
            res.status(500).send(DEFAULT_ERROR_RESPONSE.InternalServerError);
        }
    });