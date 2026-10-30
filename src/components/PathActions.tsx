import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Fab } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../store";
import { clearPath } from "../store/misc";
import { robotFollow } from "../store/thunks";

// send the drawn path, or drop it
export function PathActions() {
  const dispatch = useAppDispatch();
  const hasPath = useAppSelector((state) => state.path.length > 0);
  return (
    <div className="actions path-actions">
      <Fab color="primary" disabled={!hasPath} aria-label="Send path" onClick={() => void dispatch(robotFollow())}>
        <CheckIcon />
      </Fab>
      <Fab color="primary" disabled={!hasPath} aria-label="Clear path" onClick={() => dispatch(clearPath())}>
        <ClearIcon />
      </Fab>
    </div>
  );
}
