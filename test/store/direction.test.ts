import { describe, expect, it } from "vitest";

import type { Direction } from "../../src/api/rosie";
import { directionSlice, moveJoystick, pressKey, releaseKey } from "../../src/store/direction";
import { setMode } from "../../src/store/mode";

const reduce = (state: Direction, action: Parameters<typeof directionSlice.reducer>[1]) =>
  directionSlice.reducer(state, action);

describe("direction", () => {
  it.each([
    ["KeyW", [0, 1, 0]],
    ["KeyS", [0, -1, 0]],
    ["KeyA", [-1, 0, 0]],
    ["KeyD", [1, 0, 0]],
    ["KeyE", [0, 0, 1]], // turns counter-clockwise (left on screen)
    ["KeyQ", [0, 0, -1]], // turns clockwise (right on screen)
  ])("%s alone gives %j", (key, expected) => {
    expect(reduce([0, 0, 0], pressKey(key))).toEqual(expected);
  });

  it("steers right while going forward", () => {
    expect(reduce([0, 1, 0], pressKey("KeyD"))).toEqual([1, 1, 0]);
  });

  it("keeps steering when the throttle is released", () => {
    expect(reduce([1, 1, 0], releaseKey("KeyW"))).toEqual([1, 0, 0]);
  });

  it("stops on opposite keys", () => {
    expect(reduce([0, 1, 0], pressKey("KeyS"))).toEqual([0, 0, 0]);
  });

  it("stays within [-1, 1]", () => {
    expect(reduce([0, 1, 0], pressKey("KeyW"))).toEqual([0, 1, 0]);
  });

  it("ignores other keys", () => {
    expect(reduce([0, 1, 0], pressKey("KeyX"))).toEqual([0, 1, 0]);
  });

  it("takes the joystick's x and y, keeping the rotation", () => {
    expect(reduce([0, 0, 1], moveJoystick({ x: 0.5, y: -0.25 }))).toEqual([0.5, -0.25, 1]);
  });

  it("stops when the mode changes", () => {
    expect(reduce([1, 1, 0], setMode({ mode: "manual", value: false }))).toEqual([0, 0, 0]);
  });
});
