import { RootState } from "../root";
import { NItemsState } from "./types";

/**
 * get current data storage reducer value
 * @param state - global reducer state
 * @returns 
 */
const getItemsState = (state: RootState) => state.itemsState;

/**
 * get items state field value by field name
 * @param key 
 * @returns 
 */
export const getItemsStateField = <Key extends keyof ReturnType<typeof getItemsState>>
    (key: Key) => (...args: Parameters<typeof getItemsState>) => getItemsState(...args)[key];