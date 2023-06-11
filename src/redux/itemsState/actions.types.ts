import { NItemsState } from "./types";

// change item action payload
export type ItemsStateChangePayload<Key extends keyof NItemsState.Reducer, Value extends NItemsState.Reducer[Key]> = {
    variable: Key;
    value: Value;
};