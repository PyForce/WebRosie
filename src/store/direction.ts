import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Direction } from "../api/rosie";
import { setMode } from "./mode";

// keys of user mode, by KeyboardEvent.code (the physical key, whatever the layout)
export const KEYS: Record<string, Direction> = {
  KeyW: [0, 1, 0], // throttle forward
  KeyS: [0, -1, 0], // throttle backward
  KeyD: [1, 0, 0], // steer right
  KeyA: [-1, 0, 0], // steer left
  KeyE: [0, 0, 1], // turn left on the spot
  KeyQ: [0, 0, -1], // turn right on the spot
};

const STOP: Direction = [0, 0, 0];

export const directionSlice = createSlice({
  name: "direction",
  initialState: STOP,
  reducers: {
    pressKey(state, action: PayloadAction<string>) {
      const key = KEYS[action.payload];
      return key ? combine(state, key, 1) : state;
    },
    releaseKey(state, action: PayloadAction<string>) {
      const key = KEYS[action.payload];
      return key ? combine(state, key, -1) : state;
    },
    moveJoystick(state, action: PayloadAction<{ x: number; y: number }>) {
      return [action.payload.x, action.payload.y, state[2]];
    },
  },
  extraReducers: (builder) => {
    // a new mode starts standing still
    builder.addCase(setMode, () => STOP);
  },
});

function combine(state: Direction, key: Direction, sign: number): Direction {
  return [0, 1, 2].map((axis) =>
    Math.min(1, Math.max(-1, (state[axis] ?? 0) + sign * (key[axis] ?? 0))),
  ) as Direction;
}

export const { pressKey, releaseKey, moveJoystick } = directionSlice.actions;
