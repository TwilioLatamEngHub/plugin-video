import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from "twilio-video";

export type Callback = (...args: any[]) => void;
export type ErrorCallback = (error: TwilioError | Error) => void;
export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export type RecordingRule = {
    type: 'include' | 'exclude';
    all?: boolean;
    kind?: 'audio' | 'video';
    publisher?: string;
  };
  
export type RecordingRules = RecordingRule[];

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;