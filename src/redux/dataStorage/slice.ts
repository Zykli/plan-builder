import { createSlice,  } from '@reduxjs/toolkit'
import { dataStorageInitialState } from './pad';
import { changeItem, changeItems, removeItem, removeItems, setItem, setItems } from './actions';

const dataStorageSlice = createSlice({
    name: 'dataStorage',
    initialState: dataStorageInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(changeItem, (state, action) => {
            // get storage
            const storage = state[action.payload.storage];
            // get item
            const item = storage[action.payload.id];
            // if item and payload is array then concatenate them
            // maybe better to replace it?
            // if(Array.isArray(item) && Array.isArray(action.payload.item)) {
            //     state[action.payload.storage][action.payload.id] = [ ...item, ...action.payload.item ];
            // } else
            // if item and payload is object then merge them
            if(
                typeof item === 'object' && typeof action.payload.item === 'object' &&
                !Array.isArray(item) && !Array.isArray(action.payload.item)
            ) {
                state[action.payload.storage][action.payload.id] = !item ? action.payload.item as Required<typeof item> : { ...item, ...action.payload.item };
            } else 
            // if other simple types then replace it
            if(
                typeof item !== 'object' && typeof action.payload.item !== 'object' &&
                !Array.isArray(item) && !Array.isArray(action.payload.item))
            {
                state[action.payload.storage][action.payload.id] = action.payload.item;
            } else {
                console.error(`Can't change value to iten in store ${action.payload.storage} wiht id ${action.payload.id}`)
            }
        })
        .addCase(setItem, (state, action) => {
            state[action.payload.storage][action.payload.id] = action.payload.item;
        })
        .addCase(changeItems, (state, action) => {
            // get storage
            const storage = state[action.payload.storage];
            action.payload.items.map(el => {
                // get item
                const item = storage[el.id];
                // if item and payload is array then concatenate them
                // maybe better to replace it?
                // if(Array.isArray(item) && Array.isArray(el.item)) {
                //     state[action.payload.storage][el.id] = [ ...item, ...el.item ];
                // } else
                // if item and payload is object then merge them
                if(
                    typeof item === 'object' && typeof el.item === 'object' &&
                    !Array.isArray(item) && !Array.isArray(el.item)
                ) {
                    state[action.payload.storage][el.id] = !item ? el.item as Required<typeof item> : { ...item, ...el.item };
                } else 
                // if other simple types then replace it
                if(
                    typeof item !== 'object' && typeof el.item !== 'object' &&
                    !Array.isArray(item) && !Array.isArray(el.item))
                {
                    state[action.payload.storage][el.id] = el.item;
                } else {
                    console.error(`Can't change value to iten in store ${action.payload.storage} wiht id ${el.id}`)
                }
            })
        })
        .addCase(setItems, (state, action) => {
            action.payload.items.forEach(el => {
                state[action.payload.storage][el.id] = el.item;
            });
        })
        .addCase(removeItem, (state, action) => {
            const storage = state[action.payload.storage];
            state[action.payload.storage] = Object.typedKeys(storage).filter(id => id !== action.payload.id).reduce((a, id) => ({ ...a, [id]: storage[id] }), {});
        })
        .addCase(removeItems, (state, action) => {
            const storage = state[action.payload.storage];
            state[action.payload.storage] = Object.typedKeys(storage).filter(id => !action.payload.items.includes(id)).reduce((a, id) => ({ ...a, [id]: storage[id] }), {});
        })
    }
});

export const dataStorageReducer = dataStorageSlice.reducer;