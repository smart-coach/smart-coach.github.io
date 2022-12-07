import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
///////////////////////////////////////////////////////////////////////
/**
 * Exports all callable functions from files where implementations
 * are stored. Acts as a barrel for our cloud functions environment 
 * that rolls up all of our exports neatly.
 * 
 * Last edited by: Faizan Khan 7/23/2020
 */
export {
    requestEnergyPayload,
    syncDataFromHealth
} from './services/algorithm/energyAlgorithm';

export {
    cancelSub,
    stripeWebhooks,
    createCheckoutSession,
    createSubscriptionForIAP,
    checkSubStatusForIAP,
    createSubscriptionForIAB,
    androidEventWebhooks,
    androidEvents
} from './services/payments';

export {
    editUserProfile,
    editUserPromoCode,
    nutritionLogEditedTrigger,
    userDeletedTrigger,
    userUpdatedTrigger,
    userCreatedTrigger
} from './services/profile';

export {
    subscribeTokenToTopic,
    unsubscribeTokenFromTopic
} from './services/cloudMessaging';

export {
    exportAllUsers,
    checkAllIAP,
    sendWeeklyReports,
    removeExpiredGuestUsersAndAncientAccounts
} from './services/admin';
///////////////////////////////////////////////////////////////////////