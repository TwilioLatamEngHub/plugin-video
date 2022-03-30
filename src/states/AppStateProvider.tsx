import axios from 'axios'
import { prepServiceBaseUrl } from '../helper/api'
import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

export interface IStateContext {
    getToken(identity, name: string): Promise<{token: string}>
    isFetching: boolean
}

export const StateContext = createContext<IStateContext>(null!)
export default function AppStateProvider(props: PropsWithChildren<any>) {
    const [isFetching, setIsFetching] = useState<boolean>(false)

    let contextValue = {
        isFetching,
    } as IStateContext

    contextValue = {
        ...contextValue,
        getToken: async (identity: string, name: string) => {
            const url = prepServiceBaseUrl('video-app-test-liq-6888.twil.io')

            return axios.post(url + 'flexvideotokenizer', {
                identity,
                roomname: name
            }).then(response => response.data)
        }
    }

    const getToken: IStateContext['getToken'] = (identity, name) => {
        setIsFetching(true)
        return contextValue
            .getToken(identity, name)
            .then(token => {
                setIsFetching(false)
                return token
            })
            .catch(error => {
                console.log(error, 'Error on fetch token')
                return Promise.reject(error)
            })
    }

    return (
        <StateContext.Provider value={{...contextValue, getToken}}>
            {props.children}
        </StateContext.Provider>
    )
}

export function useAppState() {
    const context = useContext(StateContext)
    if (!context) {
        console.log('EROOOOOOOOOOU')
    }
    return context
}