import { NDataStorage } from "./types";

// item data to changeItems or changeItems actions
export type DSChangeItemData<SN extends keyof NDataStorage.Reducer> = {
    id: NDataStorage.StorageItemKeys<SN>;
    item: Partial<NDataStorage.StorageItemType<SN>>;
};

// item data to setItems or setItem actions
export type DSSetItemData<SN extends keyof NDataStorage.Reducer> = {
    id: NDataStorage.StorageItemKeys<SN>;
    item: NDataStorage.StorageItemType<SN>;
};


// change item action payload
export type DSActionItemChangePayload<SN extends keyof NDataStorage.Reducer> = DSChangeItemData<SN> & {
    storage: SN;
};

// change items actions payload
export type DSActionItemsChangePayload<SN extends keyof NDataStorage.Reducer> = {
    storage: SN;
    items: DSChangeItemData<SN>[];
};


// set item action payload
export type DSActionItemSetPayload<SN extends keyof NDataStorage.Reducer> = DSSetItemData<SN> & {
    storage: SN;
};

// set items action payload
export type DSActionItemsSetPayload<SN extends keyof NDataStorage.Reducer> = {
    storage: SN;
    items: DSSetItemData<SN>[];
};


// remove item payload
export type DSActionItemRemovePayload<SN extends keyof NDataStorage.Reducer> = Pick<DSSetItemData<SN>, 'id'> & {
    storage: SN;
}

// remove items payload
export type DSActionItemsRemovePayload<SN extends keyof NDataStorage.Reducer> = {
    storage: SN;
    items: Pick<DSSetItemData<SN>, 'id'>['id'][];
}
