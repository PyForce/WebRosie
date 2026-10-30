import { Paper } from "@mui/material";
import { Rnd } from "react-rnd";

const SIZE = 200;

// the robot's video stream, in a panel that can be moved and resized
export function Camera({ url }: { url: string }) {
  return (
    <Rnd
      default={{ x: (14 * window.innerWidth) / 15 - SIZE, y: window.innerHeight / 10, width: SIZE, height: SIZE }}
      style={{ zIndex: 1002 }}
    >
      <Paper elevation={6} style={{ width: "100%", height: "100%" }}>
        <img src={url} alt="Robot camera" style={{ width: "100%", height: "100%" }} />
      </Paper>
    </Rnd>
  );
}
