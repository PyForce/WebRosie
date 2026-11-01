import { createTheme } from "@mui/material/styles";

// WebRosie's 2017 colours (material-ui 0.19's light theme with a cyan 900 bar)
export const colors = {
  primary: "#006064", // cyan 900: also the planned trajectory, dashed
  accent: "#FF4081", // pink A200: active modes, the path, the target
  trail: "#9E9E9E", // grey 500: where the robot actually went
  text: "rgba(0, 0, 0, 0.87)",
  disabled: "rgba(0, 0, 0, 0.3)",
  error: "#C62828", // red 800
  warning: "#F9A825", // yellow 800
};

export const theme = createTheme({
  palette: {
    primary: { main: colors.primary },
    secondary: { main: colors.accent },
  },
});
