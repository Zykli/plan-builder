import { PayloadAction, createAction } from "@reduxjs/toolkit";
import { NDataStorage } from './types';
import {
    DSActionItemChangePayload,
    DSActionItemsChangePayload,
    DSActionItemSetPayload,
    DSActionItemsSetPayload,
    DSActionItemRemovePayload,
    DSActionItemsRemovePayload
} from "./actions.types";


// change item action
const actionChangeItem = 'changeItem' as const;

/**
 * change item with merge logic
 * @param payload 
 * @returns 
 */
export const changeItem = <SN extends NDataStorage.StorageName> (payload: DSActionItemChangePayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionChangeItem,
        payload
    }
};

changeItem.type = actionChangeItem;
// end change item action


// change items action
const actionChangeItems = 'changeItems' as const;

/**
 * change multiple items in one storage with merge logic
 * @param payload 
 * @returns 
 */
export const changeItems = <SN extends NDataStorage.StorageName> (payload: DSActionItemsChangePayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionChangeItems,
        payload
    }
};

changeItems.type = actionChangeItems;
// end change items action


// set item action
const actionSetItem = 'setItem' as const;

/**
 * set new value to item without merge
 * @param payload 
 * @returns 
 */
export const setItem = <SN extends NDataStorage.StorageName> (payload: DSActionItemSetPayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionSetItem,
        payload
    }
};

setItem.type = actionSetItem;
// end set item action


// set items action
const actionSetItems = 'setItems' as const;

/**
 * set new value to items in one storage without merge
 * @param payload 
 * @returns 
 */
export const setItems = <SN extends NDataStorage.StorageName> (payload: DSActionItemsSetPayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionSetItems,
        payload
    }
};

setItems.type = actionSetItems;
// end set actions action


// remove item action
const actionRemoveItem = 'removeItem' as const;

/**
 * remove item from storage by storage name & item id
 * @param payload 
 * @returns 
 */
export const removeItem = <SN extends NDataStorage.StorageName> (payload: DSActionItemRemovePayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionRemoveItem,
        payload
    }
};

removeItem.type = actionRemoveItem;
// end remove items action


// remove items action
const actionRemoveItems = 'removeItems' as const;

/**
 * remove items from storage by storage name & items ids array
 * @param payload 
 * @returns 
 */
export const removeItems = <SN extends NDataStorage.StorageName> (payload: DSActionItemsRemovePayload<SN>): PayloadAction<typeof payload> => {
    return {
        type: actionRemoveItem,
        payload
    }
};

removeItems.type = actionRemoveItems;
// end remove items action