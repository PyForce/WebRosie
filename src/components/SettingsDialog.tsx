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
  const [time, setTime] = useState(String(settings.single.time));
  const [planner, setPlanner] = useState(settings.single.planner);
  const [delay, setDelay] = useState(String(settings.path.delay));
  const [joystick, setJoystick] = useState(settings.user.joystick);

  const timeError = positiveError(time);
  const delayError = positiveError(delay);

  const accept = () => {
    dispatch(
      configOption({
        single: { time: Number(time), planner },
        path: { delay: Number(delay) },
        user: { joystick },
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
          <Tab icon={<OpenWithIcon />} label="user" />
          <Tab icon={<SendIcon />} label="command" />
        </Tabs>
        {tab === 0 && (
          <>
            <TextField
              label="Time to reach the destination"
              placeholder="amount of seconds"
              variant="standard"
              margin="normal"
              fullWidth
              value={time}
              error={Boolean(timeError)}
              helperText={timeError}
              onChange={(event) => setTime(event.target.value)}
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
            label="Time interval between path points"
            placeholder="amount of seconds"
            variant="standard"
            margin="normal"
            fullWidth
            value={delay}
            error={Boolean(delayError)}
            helperText={delayError}
            onChange={(event) => setDelay(event.target.value)}
          />
        )}
        {tab === 2 && (
          <FormControl variant="standard" margin="normal" fullWidth>
            <InputLabel id="joystick-label">When to display the joystick</InputLabel>
            <Select
              labelId="joystick-label"
              value={joystick}
              onChange={(event) => setJoystick(event.target.value as Settings["user"]["joystick"])}
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
        <Button disabled={Boolean(timeError || delayError)} onClick={accept}>
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
