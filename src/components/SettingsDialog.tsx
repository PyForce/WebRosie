import AdjustIcon from "@mui/icons-material/Adjust";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import SendIcon from "@mui/icons-material/Send";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../store";
import { configOption, type Settings } from "../store/misc";
import { colors } from "../theme";
import { DIALOG } from "./dialogs";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: Props) {
  const settings = useAppSelector((state) => state.settings);
  // the dialog's contents start from the saved settings each time it opens
  return open ? <SettingsForm key="form" settings={settings} onClose={onClose} /> : null;
}

function SettingsForm({ settings, onClose }: { settings: Settings; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [singleSpeed, setSingleSpeed] = useState(String(settings.single.speed));
  const [planner, setPlanner] = useState(settings.single.planner);
  const [pathSpeed, setPathSpeed] = useState(String(settings.path.speed));
  const [joystick, setJoystick] = useState(settings.manual.joystick);

  const singleSpeedError = positiveError(singleSpeed);
  const pathSpeedError = positiveError(pathSpeed);

  const accept = () => {
    dispatch(
      configOption({
        single: { speed: Number(singleSpeed), planner },
        path: { speed: Number(pathSpeed) },
        manual: { joystick },
      }),
    );
    onClose();
  };

  return (
    <Dialog open onClose={onClose} {...DIALOG}>
      <DialogTitle>Rosie mode settings</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_event, value: number) => setTab(value)}
          variant="fullWidth"
          textColor="inherit"
          slotProps={{ indicator: { style: { backgroundColor: colors.accent } } }}
          sx={{ backgroundColor: colors.primary, color: "white" }}
        >
          <Tab icon={<AdjustIcon />} label="single" />
          <Tab icon={<SwapCallsIcon />} label="path" />
          <Tab icon={<OpenWithIcon />} label="manual" />
          <Tab icon={<SendIcon />} label="command" />
        </Tabs>
        {tab === 0 && (
          <>
            <TextField
              label="Speed to the destination"
              placeholder="metres per second"
              variant="standard"
              margin="normal"
              fullWidth
              value={singleSpeed}
              error={Boolean(singleSpeedError)}
              helperText={singleSpeedError}
              onChange={(event) => setSingleSpeed(event.target.value)}
            />
            <FormControlLabel
              control={<Switch checked={planner} onChange={(event) => setPlanner(event.target.checked)} />}
              label="Use planner for target reach"
              labelPlacement="start"
              sx={{ ml: 0, width: "100%", justifyContent: "space-between" }}
            />
          </>
        )}
        {tab === 1 && (
          <TextField
            label="Speed along the path"
            placeholder="metres per second"
            variant="standard"
            margin="normal"
            fullWidth
            value={pathSpeed}
            error={Boolean(pathSpeedError)}
            helperText={pathSpeedError}
            onChange={(event) => setPathSpeed(event.target.value)}
          />
        )}
        {tab === 2 && (
          <FormControl variant="standard" margin="normal" fullWidth>
            <InputLabel id="joystick-label">When to display the joystick</InputLabel>
            <Select
              labelId="joystick-label"
              value={joystick}
              onChange={(event) => setJoystick(event.target.value as Settings["manual"]["joystick"])}
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="touch">Touch Device</MenuItem>
              <MenuItem value="none">Do not show</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={Boolean(singleSpeedError || pathSpeedError)} onClick={accept}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function positiveError(value: string): string {
  const number = Number(value);
  if (value.trim() === "" || Number.isNaN(number)) {
    return "must be a valid float value";
  }
  return number > 0 ? "" : "must be greater than 0";
}
