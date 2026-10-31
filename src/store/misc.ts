import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WorldMap } from "../api/rosie";

// the map on screen
export const mapSlice = createSlice({
  name: "map",
  initialState: null as WorldMap | null,
  reducers: {
    updateMap: (_state, action: PayloadAction<WorldMap>) => action.payload,
  },
});

// the path being drawn in path mode, as [x, y] points
export const pathSlice = createSlice({
  name: "path",
  initialState: [] as [number, number][],
  reducers: {
    addPathPoint(state, action: PayloadAction<[number, number]>) {
      state.push(action.payload);
    },
    clearPath: () => [],
  },
});

export type ReportLevel = "info" | "warning" | "error";
export interface Report {
  text: string;
  level: ReportLevel;
}

// the message shown at the bottom
export const reportSlice = createSlice({
  name: "report",
  initialState: null as Report | null,
  reducers: {
    notifyReport: (_state, action: PayloadAction<Report>) => action.payload,
    clearReport: () => null,
  },
});

export interface Settings {
  single: { speed: number; planner: boolean }; // m/s to the target; go around obstacles
  path: { speed: number }; // m/s along the path
  manual: { joystick: "always" | "touch" | "none" }; // when to show the on-screen joystick
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    single: { speed: 0.2, planner: false },
    path: { speed: 0.2 },
    manual: { joystick: "touch" },
  } as Settings,
  reducers: {
    configOption: (state, action: PayloadAction<Partial<Settings>>) => ({ ...state, ...action.payload }),
  },
});

export const { updateMap } = mapSlice.actions;
export const { addPathPoint, clearPath } = pathSlice.actions;
export const { notifyReport, clearReport } = reportSlice.actions;
export const { configOption } = settingsSlice.actions;
