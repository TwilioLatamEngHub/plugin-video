/**
Be sure to set
TWILIO_API_KEY_SID
TWILIO_API_KEY_SECRET
**/

import '@twilio-labs/serverless-runtime-types';

import {
    Context,
    ServerlessCallback,
    ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types';

import twilio from 'twilio';

type EventType = {
    Identity: string
}

type ContextType = {
    ACCOUNT_SID: string
    TWILIO_API_KEY_SID: string
    TWILIO_API_KEY_SECRET: string
}

function sendResponse(data: {token: string}) {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    return response;
  }
  
export const handler: ServerlessFunctionSignature<ContextType, EventType> = function(
    context: Context<ContextType>,
    event: EventType,
    callback: ServerlessCallback
) {
  
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
  
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      context.ACCOUNT_SID,
      context.TWILIO_API_KEY_SID,
      context.TWILIO_API_KEY_SECRET
    );
  
    // Assign identity to the token
    token.identity = event.Identity || 'identity';
  
    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant();
    token.addGrant(grant);
  
    // Serialize the token to a JWT string
    return callback(null, sendResponse({
        token: token.toJwt()
    }));
  
  };