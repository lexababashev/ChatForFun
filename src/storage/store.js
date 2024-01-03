import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import settingsReducer from "../reducers/settingsReducer";

const rootReducer = combineReducers({
  settings: settingsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;