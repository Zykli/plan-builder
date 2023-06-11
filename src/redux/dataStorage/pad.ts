// here need import item type in your block
import { Item } from '../../utils/types';
import { NDataStorage } from './types';


/**
 * pad type to use your types in reducer
 * to type
 * {
 *  flights: string,
 *  lists: number,
 *  news: {[key: string]: ...}
 * }
 * reducer will be
 * {
 *  flights: {
 *      [id: key]: string | null
 *  },
 *  lists: {
 *      [id: key]: number | null
 *  },
 *  lists: {
 *      [id: key]: {[key: string]: ...} | null
 *  },
 * }
 */

type ObjectType = {
    id: string;
};

type ArrayType = any[];

export type ReducerTypeDad = {
    // testString: string;
    // testNumber: number;
    // testObject: ObjectType;
    // testArray: ArrayType;
    items: Item;
};

/**
 * base state to data storage reducer
 */
export const dataStorageInitialState: NDataStorage.Reducer = {
    // testNumber: {},
    // testObject: {},
    // testString: {},
    // testArray: {},
    items: {}
};