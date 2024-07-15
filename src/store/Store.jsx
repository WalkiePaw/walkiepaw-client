import { configureStore}  from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";


import authReducer from "./AuthSlice.jsx";
import ChatReducer from "./ChatSlice.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: ChatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
