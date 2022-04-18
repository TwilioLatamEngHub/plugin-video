import { loadImage } from "../helper/image";
import { LocalTrackPublication, VideoTrack } from "twilio-video";
import { VirtualBackgroundProcessor } from '@twilio/video-processors'
import { useEffect, useState } from "react";

const useBackground = (tracks: LocalTrackPublication[], imageUrl = 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80') => {
    const [tracksWithBG, setTracksWithBG] = useState<LocalTrackPublication[]>([])
    useEffect(() => {
        console.log('>>>>>>>>>>>>>>>>>>')
        async function changeTracksWithBackground() {
            for (const track of tracks) {
                if ( track.kind === 'video') {
                    const trackDom = track.track as VideoTrack
                    const image = await loadImage(imageUrl)
                    const background = new VirtualBackgroundProcessor({
                        assetsPath: '/',
                        backgroundImage: image, 
                        maskBlurRadius: 3
                    })

                    await background.loadModel()
                    trackDom.addProcessor(background)
                }
            }
            setTracksWithBG(tracks)
        }
        if (tracks.length && process.env.REACT_APP_WITH_BG) {
            changeTracksWithBackground()
        } else {
            setTracksWithBG(tracks)
        }
    }, [tracks, imageUrl])
    
    
    return {
        tracks: tracksWithBG
    }
}

export default useBackground
