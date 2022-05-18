import {Manager, TaskContextProps, TaskTaskStatus, withTaskContext } from "@twilio/flex-ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AudioTrack, LocalAudioTrack, LocalTrackPublication, LocalVideoTrack, RemoteParticipant, RemoteTrackPublication, Room, VideoTrack } from 'twilio-video';
import { useAppState } from "../states/AppStateProvider";
import useRoom from "../hooks/useRoom";
import Video from "./Video";
import useBackground from "../hooks/useBackground";

interface IncomingVideoProps extends TaskContextProps {
    manager: Manager
}

interface AudioTrackProps {
    track: AudioTrack
}

interface VideoTrackProps {
    track: VideoTrack
}

const IncomingVideo:React.FC<IncomingVideoProps> = ({task, manager }: IncomingVideoProps) => {
    const roomName = task.attributes.videoChatRoom;
    const { getToken } = useAppState()
    const { room, connect } = useRoom({name: roomName})
    const [activeRoom, setActiveRoom] = useState<Room>(null);
    const [taskStatus, setTaskStatus] = useState<TaskTaskStatus>()
    const [localAudio, setLocalAudio] = useState<LocalAudioTrack>(null);
    const [localAudioDisabled, setLocalAudioDisabled] = useState<boolean>(null);
    const [localVideo, setLocalVideo] = useState<LocalVideoTrack>(null);
    const [screenTrack, setScreenTrack] = useState<MediaStreamTrack | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(null);
    const [localTracks, setLocalTracks] = useState<LocalTrackPublication[]>([])
    const { tracks: tracksWithBG } = useBackground(localTracks, process.env.BACKGROUND_URL)
    const mediaRef = useRef(null);
    

    const attachParticipantTracks = useCallback((participant, container) => {
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
                const tracks = publication.track;
                attachTracks(tracks, container);
            }
        })
    }, [])

    const disconnect = useCallback(() => {
        activeRoom && activeRoom.disconnect();
        setActiveRoom(null)
        setLocalTracks([])
    }, [activeRoom])

    const attachLocalTracks = useCallback((tracks: LocalTrackPublication[], container) => {
        setLocalTracks(tracks)
        for (const track of tracks) {
            let trackDom = null;
            if (track.kind == 'audio') {
                trackDom = track as AudioTrackProps;
            } else if (track.kind == 'video') {
                trackDom = track as VideoTrackProps
            }
            trackDom = trackDom.track.attach()
            container.appendChild(trackDom)
        }
    }, [])

    const roomJoined = useCallback((room: Room) => {
        setActiveRoom(room)

        Array.from(room.localParticipant.tracks.values()).forEach((track: LocalTrackPublication | RemoteTrackPublication) => {
            if (track.kind === 'audio') {
                setLocalAudio(track.track as LocalAudioTrack);
                return;
            }
            setLocalVideo(track.track as LocalVideoTrack);
            return;
        })

        attachLocalTracks(Array.from(room.localParticipant.tracks.values()), mediaRef.current)

        room.on('participantConnected', (participant: RemoteParticipant) => {
            participant.tracks.forEach((publication) => {
                if (publication.isSubscribed) {
                    const track = publication.track;
                    attachParticipantTracks(track, mediaRef.current)
                }
            })
        })

        room.on('trackSubscribed', (track) => {
            attachTracks([track], mediaRef.current)
        })

        room.on('trackUnsubscribed', (track) => {
            if (track.kind !== 'data') {
                track.detach().forEach(function(detachedElement) {
                    detachedElement.remove();
                });
            }
        })

        room.on('participantDisconnected', (participant) => {
            console.log("Participant '" + participant.identity + "' left the room");
        });

        room.on('disconnected', () => {
            console.log('Left');
        });
        
    }, [attachParticipantTracks, attachLocalTracks])

    useEffect(() => {
        const taskStatusProps = task.taskStatus;
        const disconnectedStatus = [
            'completed',
            'wrapping'
        ]
        if (taskStatus !== taskStatusProps) {
            setTaskStatus(taskStatusProps);
        }
        if (taskStatusProps === 'assigned') {
            getToken(manager.workerClient.attributes.full_name, task.attributes.videoChatRoom)
                .then(({ token }) => {
                    connect(token)
                })
        }
        if (disconnectedStatus.includes(taskStatusProps)) {
            disconnect()
        }

        
        if (process.env.REACT_APP_WITH_BG && tracksWithBG.length) {
            attachLocalTracks(tracksWithBG, mediaRef.current)
        }
        return () => {
            const taskStatusProps = task.taskStatus;
            if (disconnectedStatus.includes(taskStatusProps)) {
                disconnect()
            }
        }
        
    }, [task])


    const attachTracks = (tracks, container) => {
        tracks.forEach(function(track) {
            const trackDom = track.attach();
            trackDom.style.width = "100%";

            container.appendChild(trackDom);
        });
        
    }

    const mute = (): void => {
        localAudio.disable()
        setLocalAudioDisabled(true)
    }

    const unMute = (): void => {
        localAudio.enable()
        setLocalAudioDisabled(false)
    }

    const getScreenShare = () => {
        if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({video: true});
        }
    }

    const screenShare = () => {
        getScreenShare()
            .then(stream => {
                const screenTrack = stream.getVideoTracks()[0];
                activeRoom.localParticipant.publishTrack(screenTrack)
                setScreenTrack(screenTrack)
                setIsScreenSharing(true)
            })
    }

    const stopScreenShare = () => {
        activeRoom.localParticipant.unpublishTrack(screenTrack)
        setScreenTrack(null)
        setIsScreenSharing(false)
    }

    return (
        <Video 
            isScreenSharing={isScreenSharing} 
            localAudioDisabled={localAudioDisabled}
            mediaRef={mediaRef}
            room={room}
            handleJoin={roomJoined}
            mute={mute}
            unMute={unMute}
            stopScreenShare={stopScreenShare}
            screenShare={screenShare}
        />
    )
}

export default withTaskContext(IncomingVideo)