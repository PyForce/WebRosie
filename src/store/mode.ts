import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { selectRobot } from "./robots";

export type ModeName = "single" | "path" | "manual" | "order";
export type ModeState = Record<ModeName, boolean>;

const NONE: ModeState = { single: false, path: false, manual: false, order: false };

// one mode at a time: turning one on turns the others off
export const modeSlice = createSlice({
  name: "mode",
  initialState: NONE,
  reducers: {
    setMode(state, action: PayloadAction<{ mode: ModeName; value: boolean }>) {
      const { mode, value } = action.payload;
      return value ? { ...NONE, [mode]: true } : { ...state, [mode]: false };
    },
  },
  extraReducers: (builder) => {
    // deselecting the robot leaves every mode
    builder.addCase(selectRobot, (state, action) => (action.payload === null ? NONE : state));
  },
});

export const { setMode } = modeSlice.actions;
