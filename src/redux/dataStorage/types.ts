import { ReducerTypeDad } from "./pad";

export namespace NDataStorage {

    export type StorageItem<I = any> = {
        [key: string]: I | null;
    };

    type ReducerGen<S extends {[StorageName: string]: any} = {[key: string]: any}> = {
        [Key in keyof S]: StorageItem<S[Key]>;
    };

    export type Reducer = ReducerGen<ReducerTypeDad>;

    export type StorageName = keyof NDataStorage.Reducer;

    export type StoragesUnion = NDataStorage.Reducer[StorageName];

    export type StorageItemKeys<SN extends StorageName> = keyof Reducer[SN];

    export type StorageItemType<SN extends StorageName> = Reducer[SN][StorageItemKeys<SN>];
};