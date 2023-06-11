import { configureStore } from '@reduxjs/toolkit';
import { dataStorageReducer } from './dataStorage/slice';

export const store = configureStore({
    reducer: {
        dataStorage: dataStorageReducer
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;