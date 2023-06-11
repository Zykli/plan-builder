import { useEffect, useCallback } from 'react'
import { remove, uniq } from 'lodash'

const signalsHandlers: { [key: string]: Array<() => void> } = {}

export const sendSignal = (signal: string) => {
    const handlers = signalsHandlers[signal] || []
    handlers.forEach(handler => {
        handler()
    })
}

export const addHandler = (signal: string, handler: () => void) => {
    signalsHandlers[signal] = signalsHandlers[signal] ? uniq([...signalsHandlers[signal], handler]) : [handler]
}

export const removeHandler = (signal: string, handler: () => void) => {
    if (signalsHandlers[signal]) {
        signalsHandlers[signal] = remove(signalsHandlers[signal], (n) => n === handler)
    }
}


export const useSignal = (signal: string, handler: () => void) => {
    const callback = useCallback(handler, [])
    useEffect(() => {
        addHandler(signal, callback)
        return () => {
            removeHandler(signal, callback)
        }
    }, [])
}