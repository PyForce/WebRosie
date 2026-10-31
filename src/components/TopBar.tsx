import AdjustIcon from "@mui/icons-material/Adjust";
import MenuIcon from "@mui/icons-material/Menu";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import { AppBar, IconButton, Toolbar, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "../store";
import type { ModeName } from "../store/mode";
import { changeMode } from "../store/thunks";
import { colors } from "../theme";

const MODES: [ModeName, string, ReactNode][] = [
  ["single", "Single Point Mode", <AdjustIcon key="single" />],
  ["path", "Path Mode", <SwapCallsIcon key="path" />],
  ["manual", "Manual Mode", <OpenWithIcon key="manual" />],
];

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.robots.selected);
  const mode = useAppSelector((state) => state.mode);

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar sx={{ minHeight: 64, pl: "8px !important", pr: "8px !important" }}>
        <IconButton color="inherit" aria-label="Menu" onClick={onMenu} size="large">
          <MenuIcon />
        </IconButton>
        <span style={{ flexGrow: 1 }} />
        {selected &&
          MODES.map(([name, label, icon]) => (
            <Tooltip key={name} title={label}>
              <IconButton
                aria-label={label}
                onClick={() => dispatch(changeMode(name, !mode[name]))}
                size="large"
                sx={{ color: mode[name] ? colors.accent : "white" }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          ))}
      </Toolbar>
    </AppBar>
  );
}
