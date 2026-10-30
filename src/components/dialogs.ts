import type { DialogProps } from "@mui/material";

// WebRosie's dialogs since 2017: 75% of the window, at most 768 px
export const DIALOG: Partial<DialogProps> = {
  maxWidth: false,
  slotProps: { paper: { sx: { width: "75%", maxWidth: 768 } } },
};
