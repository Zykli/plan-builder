import { useDispatch, useSelector } from "react-redux";
import { NDataStorage } from "./types";
import { useAppSelector } from "../hooks";
import { DSGetItem, DSGetStorage } from "./selectors";
import { changeItem, setItem, removeItem as removeItemAction } from "./actions";
import { useCallback, useState } from "react";
import { NonNullableParams, PickByValue, TValue } from "../../utils/utils.types";

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

type Storages = TValue<NDataStorage.Reducer>;
type WithType = Extract<TValue<Storages>, {type: any}>;
type StoragesWithType = PickByValue<NDataStorage.Reducer, NDataStorage.StorageItem<WithType>>;

export const useDSStorageItemsByItemType = <Storage extends keyof StoragesWithType, Type extends NonNullable<NDataStorage.Reducer['items'][keyof NDataStorage.Reducer['items']]>['type']>
    (storageName: Storage, type: Type) => {
        const storage = useDSStorage(storageName);
        const itemsByType = Object.values(storage.storage).filter(el => el?.type === type) as Extract<TValue<typeof storage.storage>, { type: typeof type }>[];
        return itemsByType;
    };