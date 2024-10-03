import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './Slices/userSlide';
import searchReducer from './Slices/searchSlice'
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/lib/persistStore';

const rootReducer = combineReducers({
    user: userReducer,
    searchTerm: searchReducer
})

const persistConfig = {
    key: 'root',
    version:1,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>{
        return getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export const persistor = persistStore(store);

