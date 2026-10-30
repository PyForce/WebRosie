import { describe, expect, it } from "vitest";

import { addRobot, moveRobot, removeRobot, robotsSlice, selectRobot, type RobotInfo } from "../../src/store/robots";

const simubot: RobotInfo = {
  id: "localhost:5000",
  name: "SIMUBOT",
  host: "localhost",
  port: 5000,
  video: null,
  vector: "http://localhost:5000/vector",
  size: [0.2, 0.42, 0],
  position: null,
};
const reduce = robotsSlice.reducer;

describe("robots", () => {
  it("adds a robot once per address", () => {
    let state = reduce(undefined, addRobot(simubot));
    state = reduce(state, addRobot({ ...simubot, name: "renamed" }));
    expect(state.list.map((robot) => robot.name)).toEqual(["renamed"]);
  });

  it("keeps each robot's position", () => {
    let state = reduce(undefined, addRobot(simubot));
    state = reduce(state, moveRobot({ id: simubot.id, position: { x: 1, y: 2, theta: 0.5 } }));
    expect(state.list[0]?.position).toEqual({ x: 1, y: 2, theta: 0.5 });
  });

  it("forgets the selection when the selected robot goes", () => {
    let state = reduce(undefined, addRobot(simubot));
    state = reduce(state, selectRobot(simubot.id));
    state = reduce(state, removeRobot(simubot.id));
    expect(state).toEqual({ list: [], selected: null });
  });
});
