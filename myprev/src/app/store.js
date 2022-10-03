import userReducer from './features/userSlice'
import tokenReducer from './features/tokenSlice'
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root', 
  storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)




// export default configureStore({
//   reducer: {
//     user: userReducer,
//     token: tokenSlice
//   },
// })





