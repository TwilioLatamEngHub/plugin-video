import { useCallback, useEffect, useRef, useState } from 'react'
import Video, { ConnectOptions, Room } from 'twilio-video'

export default (options? : ConnectOptions) => {
    const optionsRef = useRef(options)    
    const [room, setRoom] = useState<Room | null>(null)
    const [ isConnecting, setIsConnecting] = useState<boolean>(false)
    useEffect(() => {
        optionsRef.current = options
    }, [options])

    const connect = useCallback(token => {
        setIsConnecting(true)
        return Video.connect(token, {...optionsRef.current})
            .then( newRoom => {
                setRoom(newRoom)
                const disconnect = () => newRoom.disconnect()
                newRoom.once('disconnected', () => {
                    disconnect()
                    setRoom(null)
                })
                setIsConnecting(false)
            })
    }, [])

    return { room, connect, isConnecting }
}