import { PayloadAction, createAction } from "@reduxjs/toolkit";
import { NItemsState } from './types';
import {
    ItemsStateChangePayload
} from "./actions.types";


// change item action
const actionChangeState = 'changeState' as const;

/**
 * change state with merge logic
 * @param payload 
 * @returns 
 */
export const changeState = <Key extends keyof NItemsState.Reducer, Value extends NItemsState.Reducer[Key]> (payload: ItemsStateChangePayload<Key, Value>): PayloadAction<typeof payload> => {
    return {
        type: actionChangeState,
        payload
    }
};

changeState.type = actionChangeState;
// end change state action