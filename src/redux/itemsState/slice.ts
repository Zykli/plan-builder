import { createSlice,  } from '@reduxjs/toolkit'
import { changeState } from './actions';
import { baseItemsStateReducer } from './constants';

const itemsStateSlice = createSlice({
    name: 'dataStorage',
    initialState: baseItemsStateReducer,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(changeState, (state, action) => {
            state[action.payload.variable] = action.payload.value;
        })
    }
});

export const itemsStateReducer = itemsStateSlice.reducer;