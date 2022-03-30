import React, { useEffect } from 'react'
import { Button } from '@twilio/flex-ui'
import { Room } from 'twilio-video'

const ButtonStyle = {
    margin: '20px 10px'
}

interface VideoProps {
    isScreenSharing: boolean,
    localAudioDisabled: boolean,
    mediaRef: React.MutableRefObject<any>,
    unMute: () => void,
    mute: () => void,
    screenShare: () => void,
    stopScreenShare: () => void,
    handleJoin: (room: Room | null) => void,
    room: Room | null
}

const Video: React.FC<VideoProps> = ({ isScreenSharing, localAudioDisabled, mediaRef, mute, screenShare, stopScreenShare, unMute, room, handleJoin }: VideoProps) => {

    useEffect(() => {
        if (room) {
            handleJoin(room)
        }
    }, [room, handleJoin])
    return (
        <div>
            { !isScreenSharing ? <Button onClick={screenShare} style={ButtonStyle} className="Twilio-Button css-zsovk7">Screen Share</Button> : null }
            { isScreenSharing ? <Button onClick={stopScreenShare} style={ButtonStyle} className="Twilio-Button css-zsovk7">Stop Screen Share</Button> : null }
            { !localAudioDisabled ? <Button onClick={ mute } style={ButtonStyle} className="Twilio-Button css-zsovk7">Mute</Button> : null }
            { localAudioDisabled ? <Button onClick={ unMute } style={ButtonStyle} className="Twilio-Button css-zsovk7">Unmute</Button> : null }
            <div ref={mediaRef} id="remote-media" style={{
                overflow: "hidden",
                width: "100%",
                resize: "horizontal"
            }} />
        </div>
    )
}

export default Video