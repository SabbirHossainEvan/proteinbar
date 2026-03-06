import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { publicApi } from "./api/publicApi";

export const store = configureStore({
  reducer: {
    [publicApi.reducerPath]: publicApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(publicApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
