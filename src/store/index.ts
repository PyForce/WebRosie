import { combineSlices, configureStore, type ThunkAction, type UnknownAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { directionSlice } from "./direction";
import { mapSlice, pathSlice, reportSlice, settingsSlice } from "./misc";
import { modeSlice } from "./mode";
import { robotsSlice } from "./robots";

export const reducer = combineSlices(
  robotsSlice,
  modeSlice,
  directionSlice,
  mapSlice,
  pathSlice,
  reportSlice,
  settingsSlice,
);

export function makeStore() {
  return configureStore({ reducer });
}

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, UnknownAction>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
