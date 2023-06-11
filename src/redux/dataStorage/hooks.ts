import { useDispatch, useSelector } from "react-redux";
import { NDataStorage } from "./types";
import { useAppSelector } from "../hooks";
import { DSGetItem, DSGetStorage } from "./selectors";
import { changeItem, setItem, removeItem as removeItemAction } from "./actions";
import { useCallback, useState } from "react";

/**
 * return current storage value by storage name
 * @param storageName - storage name to selector
 * @returns 
 */
export const useDSStorage = <SN extends keyof NDataStorage.Reducer> (
    storageName: SN
) => {
    const storage = useSelector(DSGetStorage(storageName));

    return {
        storage
    };
};

/**
 * return item and actions with that item by storage name & item id
 * @param storage - storage name
 * @param id - item id
 * @returns 
 */
export const useDSItem = <SN extends keyof NDataStorage.Reducer, ID extends keyof NDataStorage.Reducer[SN]> (
    storage: SN,
    id: ID
) => {

    const dispatch = useDispatch();

    const item = useSelector(DSGetItem(storage, id));

    const [ isEdited, setIsEdited ] = useState(false);

    const onChange = useCallback((value: Partial<typeof item>) => {
        dispatch(changeItem({
            storage,
            id,
            item: value
        }));
        setIsEdited(true);
    }, []);

    const setValue = useCallback((value: typeof item) => {
        dispatch(setItem({
            storage,
            id,
            item: value
        }));
        setIsEdited(true);
    }, []);

    const removeItem = useCallback(() => {
        dispatch(removeItemAction({
            storage,
            id
        }));
        setIsEdited(false);
    }, [id]);

    return {
        item,
        isEdited,
        setIsEdited,
        onChange,
        setValue,
        removeItem
    };
};