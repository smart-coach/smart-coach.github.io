/**
 * This service controls any variables that change based on whether or not the 
 * environment being built for is production or development. IT SHOULD NEVER 
 * BE MODIFIED unless you are building for production.
 * 
 * Last edited by: Faizan Khan 10/9/2020
 */

/**
 * BE EXTREMELY CAREFUL. IF THIS VARIABLE IS FLIPPED TO TRUE THEN 
 * THE APPLICATION WILL BE BUILT SUCH THAT IT IS HOOKED UP TO ALL 
 * OF OUR PROD THIRD PARTY RESOURCES.
 * 
 * This variable should be false all the time unless we are creating
 * a production build. If the variable is false then we know that 
 * we are building for the development environment. If it is true
 * than we are building for the production environment.
 */
export const isProduction: boolean = true;

/**
 * Dev path to the SmartCoach rfr tdee prediction model 
 */
export const MODEL_PATH_DEV: string = "";

/**
 * Prod path to the SmartCoach rfr tdee prediction model 
 */
export const MODEL_PATH_PROD: string = "";

/**
 * Dev Plan ID for premium monthly that is used to create subscriptions through stripe for individuals.
 * This value can be found through the Stripe dashboard by going to products, clicking 
 * on the product and then looking for the plan. Next to the plan should be an 
 * 'API ID' with the price key.
 */
export const PREMIUM_INDIVIDUAL_MONTHLY_PLAN_ID_DEV: string = "price_1KvL9LSB5CzJfLCJ4jRF2xGN";

/**
 * Prod Plan ID for premium monthly that is used to create subscriptions through stripe for individuals.
 * This value can be found through the Stripe dashboard by going to products, clicking 
 * on the product and then looking for the plan. Next to the plan should be an 
 * 'API ID' with the price key.
 */
export const PREMIUM_INDIVIDUAL_MONTHLY_PLAN_ID_PROD: string = "price_1LDlO1SB5CzJfLCJv009X0jc";

/**
 * Dev key for stripe api to perform general operations like subscription lifecycle CRUD
 */
export const STRIPE_API_KEY_DEV: string = "sk_test_51Kh6ZxSB5CzJfLCJl4KZ3jP5eEMqFAonukfM6SJ37IFxlu9G4cunKwEptyuNzGyvZL5Y720d28ioibh0dOHLLA6Z00Jtw1lFPV";

/**
 * Dev key for stripe webhook API to verify that requests are legitimate.
 */
export const STRIPE_ENDPOINT_SECRET_DEV: string = "whsec_oJ1EQKj5G92eipfvQHxIP568v6Q9KQiY";

/**
 * Prod key for stripe api to perform general operations like subscription lifecycle CRUD
 */
export const STRIPE_API_KEY_PROD: string = "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";

/**
 * Prod key for stripe webhook API to verify that requests are legitimate.
 */
export const STRIPE_ENDPOINT_SECRET_PROD: string = "whsec_zUP9zb6sama3QPX6XGmy7rrHPc9Ii69T";

/**
 * Dev secret key used to authenticated into apple IAP API.
 */
export const APPLE_SECRET: string = "";

/**
 * Dev URL used to get access to apples receipt validation API
 */
export const APPLE_RECEIPT_VALIDATION_URL_DEV: string = '';

/**
 * Prod URL used to get access to apples receipt validation API
 */
export const APPLE_RECEIPT_VALIDATION_URL_PROD: string = "";

/**
 * API key used for the internal SC python API in dev
 */
export const SC_API_KEY_DEV: string = "";

/**
 * API key used for the internal SC python API in prod
 */
export const SC_API_KEY_PROD: string = "";

/**
* URL used for the internal SC python API in dev
*/
export const SC_API_URL_DEV: string = "";

/**
 * URL used for the internal SC python API in prod
 */
export const SC_API_URL_PROD: string = "";

/**
 * Returns the correct environment variable to be used as the URL for 
 * apple's receipt validation API in dev.
 */
export function getDevUrlForAppleReceiptValidationAPI(): string {
    return APPLE_RECEIPT_VALIDATION_URL_DEV;
}

/**
 * Returns the correct environment variable to be used as the URL for 
 * apple's receipt validation API in production.
 */
export function getProdUrlForAppleReceiptValidationAPI(): string {
    return APPLE_RECEIPT_VALIDATION_URL_PROD;
}

/**
 * Returns the correct environment variable to be used to authenticate into 
 * apples's receipt validation API.
 */
export function getAppleSecretKey(): string {
    return APPLE_SECRET;
}

/**
 * Returns the correct environment variable to be used as the model path for the GCP AI API.
*/
export function getModelPath(): string {
    return getCorrectEnvironmentVariable(MODEL_PATH_DEV, MODEL_PATH_PROD);
}

/**
 * Returns the correct environment variable to be used as the planID of the individual premium subscription.
*/
export function getStripeIndividualPremiumSubId(): string {
    return getCorrectEnvironmentVariable(PREMIUM_INDIVIDUAL_MONTHLY_PLAN_ID_DEV, PREMIUM_INDIVIDUAL_MONTHLY_PLAN_ID_PROD);
}

/**
 * Returns the correct environment variable to be used to initialize the stripe API.
*/
export function getStripeAPIKey(): string {
    return getCorrectEnvironmentVariable(STRIPE_API_KEY_DEV, STRIPE_API_KEY_PROD);
}

/**
 * Returns the correct environment variable to be used to mark stripe webhooks.
*/
export function getStripeEndpointSecret(): string {
    return getCorrectEnvironmentVariable(STRIPE_ENDPOINT_SECRET_DEV, STRIPE_ENDPOINT_SECRET_PROD);
}

/**
 * Returns the correct environment variable to be used to as the SC internal API key.
*/
export function getKeyScAPI(): string {
    return getCorrectEnvironmentVariable(SC_API_KEY_DEV, SC_API_KEY_PROD);
}

/**
 * Returns the correct environment variable to be used to as the SC internal API URL.
*/
export function getUrlScAPI(): string {
    return getCorrectEnvironmentVariable(SC_API_URL_DEV, SC_API_URL_PROD);
}

/**
 * Reduces repeated logic for getting correct variable based upon environment. 
 * If the environment is production, then the procution variable is returned.
 * If the environment is development then the development variable is returned.
 * 
 * @param developmentVariable Variable used in the development environment.
 * @param productionVariable  Variable used in the production environment.
 */
export function getCorrectEnvironmentVariable(developmentVariable: any, productionVariable: any) {
    if (isProduction) {
        return productionVariable;
    } else {
        return developmentVariable;
    }
}