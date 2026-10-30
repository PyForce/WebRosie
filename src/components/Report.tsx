import { Snackbar, SnackbarContent } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../store";
import { clearReport } from "../store/misc";
import { colors } from "../theme";

const BACKGROUNDS = { info: undefined, warning: colors.warning, error: colors.error };

// messages from the robots and the app, at the bottom of the screen
export function Report() {
  const dispatch = useAppDispatch();
  const report = useAppSelector((state) => state.report);
  return (
    <Snackbar
      open={report !== null}
      autoHideDuration={2000}
      onClose={() => dispatch(clearReport())}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent message={report?.text ?? ""} sx={{ backgroundColor: report ? BACKGROUNDS[report.level] : undefined }} />
    </Snackbar>
  );
}
