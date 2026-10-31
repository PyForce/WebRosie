import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Position } from "../api/rosie";

export interface RobotInfo {
  id: string; // host:port
  name: string;
  host: string;
  port: number;
  video: string | null; // full URL of the robot's video stream, if any
  thumbnail: string; // URL of the robot's picture
  vector: string; // URL of the robot's icon, drawn on the map
  size: [number, number, number]; // length, width, height (m)
  position: Position | null;
}

export interface RobotsState {
  list: RobotInfo[];
  selected: string | null;
}

const initialState: RobotsState = { list: [], selected: null };

export const robotsSlice = createSlice({
  name: "robots",
  initialState,
  reducers: {
    addRobot(state, action: PayloadAction<RobotInfo>) {
      state.list = [...state.list.filter((robot) => robot.id !== action.payload.id), action.payload];
    },
    removeRobot(state, action: PayloadAction<string>) {
      state.list = state.list.filter((robot) => robot.id !== action.payload);
      if (state.selected === action.payload) {
        state.selected = null;
      }
    },
    moveRobot(state, action: PayloadAction<{ id: string; position: Position }>) {
      const robot = state.list.find((candidate) => candidate.id === action.payload.id);
      if (robot) {
        robot.position = action.payload.position;
      }
    },
    selectRobot(state, action: PayloadAction<string | null>) {
      state.selected = action.payload;
    },
  },
});

export const { addRobot, removeRobot, moveRobot, selectRobot } = robotsSlice.actions;
