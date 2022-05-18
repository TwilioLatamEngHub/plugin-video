/**
Be sure to set
TWILIO_WORKSPACE_SID
TWILIO_VIDEO_WORKFLOW_SID
TWILIO_SYNC_SERVICE_SID
**/

import '@twilio-labs/serverless-runtime-types';

import {
    Context,
    ServerlessCallback,
    ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types';
import twilio from 'twilio';
import { TaskInstance } from 'twilio/lib/rest/autopilot/v1/assistant/task';

type EventType = {
    roomName: string
    customerName: string
    phoneNumber: string
    worker: string
}

type ContextType = {
    TWILIO_WORKSPACE_SID: string
    TWILIO_VIDEO_WORKFLOW_SID: string
}

interface ITaskAttr {
    name: string
    url: string
    flexWorker: string
    phoneNumber: string
    videoChatRoom: string
}

function createTask(client:twilio.Twilio, workspace: string, workflow: string, taskAttributes: ITaskAttr) {
    return new Promise((resolve, reject) => {
      client.taskrouter.workspaces(workspace).tasks
      .create({
          attributes: JSON.stringify(taskAttributes),
          workflowSid: workflow,
          taskChannel: 'video'
      })
      .then((task) => resolve(task))
      .catch((error) => reject(error))
    })
}
  
export const handler: ServerlessFunctionSignature<ContextType, EventType> = function(
    context: Context<ContextType>,
    event: EventType,
    callback: ServerlessCallback
) {
  
    const workspace = context.TWILIO_WORKSPACE_SID;
    const workflow = context.TWILIO_VIDEO_WORKFLOW_SID;
    const { roomName, customerName, phoneNumber, worker } = event;
  
    const client: twilio.Twilio = context.getTwilioClient();
  
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    createTask(client, workspace, workflow, {
        name: customerName,
        url: context.DOMAIN_NAME,
        flexWorker: decodeURI(worker),
        phoneNumber: phoneNumber,
        videoChatRoom: roomName
    })
    .then(newTask => {
        const task = newTask as TaskInstance
        response.setBody(task.sid);
        callback(null, response);
    })
    .catch((error) => {
        console.log(error)
        callback(error)
    });
  };