import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as functionWrappers from '../services/cloudfunction'

/**
 * Functions within this file are responsible for various operations related to 
 * firebase cloud messaging topic subscribe and unsubscribe for web. Any FCM related 
 * functionality should go through a function in this file. Functions within this file are almost a 
 * backend for the firebase messaging service in the frontend which uses these callable 
 * functions for cloud messaging.
 * 
 * Last edited by: Faizan Khan 15/08/2022
 */

/**
 * This cloud function is used to subscribe a token to a topic.
 * It's called from the frontend through the firebase messaging service.
 * This is only applicable for web as mobile topic subscriptions are
 * fairly straigtforward.
 */
export const subscribeTokenToTopic = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    return await functionWrappers.authenticatedCloudFunctionWrapper(context,
        async () => {
            const firebaseMessaging = admin.messaging();
            await firebaseMessaging.subscribeToTopic(data.token, data.topic).then((response) => {
                console.log(`Successfully subscribed User with Token: ${data.token} to topic: ${data.topic}`, response);
            }).catch(err => {
                console.log(`Error subscribing User with Token: ${data.token} to topic: ${data.topic}`, err);
            });
        });
});

/**
 * This cloud function is used to unsubscribe a token from a topic.
 * It's called from the frontend through the firebase messaging service.
 * This is only applicable for web as mobile topic unsubscriptions are
 * fairly straigtforward.
 */
export const unsubscribeTokenFromTopic = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    return await functionWrappers.authenticatedCloudFunctionWrapper(context,
        async () => {
            const firebaseMessaging = admin.messaging();
            await firebaseMessaging.unsubscribeFromTopic(data.token, data.topic).then((response) => {
                console.log(`Successfully unsubscribed User with Token: ${data.token} from topic: ${data.topic}`, response);
            }).catch(err => {
                console.log(`Error unsubscribing User with Token: ${data.token} from topic: ${data.topic}`, err);
            });
        });
});