import { RootState } from "../root";
import { NDataStorage } from "./types";

/**
 * get current data storage reducer value
 * @param state - global reducer state
 * @returns 
 */
const getDSState = (state: RootState) => state.dataStorage;

/**
 * get storage item by storage name
 * @param storage - storage name 
 * @returns 
 */
export const DSGetStorage = <SN extends keyof ReturnType<typeof getDSState>>
    (storage: SN) => (...args: Parameters<typeof getDSState>) => getDSState(...args)[storage];

/**
 * get item from storage item by storage name & item id
 * @param storage - storage name
 * @param id - item id
 * @returns 
 */
export const DSGetItem = <SN extends keyof ReturnType<typeof getDSState>, ID extends keyof NDataStorage.Reducer[SN]>
    (storage: SN, id: ID) => (...args: Parameters<typeof getDSState>) => DSGetStorage(storage)(...args)[id];