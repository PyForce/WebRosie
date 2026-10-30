import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

import { DIALOG } from "./dialogs";

interface Props {
  open: boolean;
  onClose: (robot: { host: string; port: number } | null) => void;
}

export function RobotDialog({ open, onClose }: Props) {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");

  return (
    <Dialog open={open} onClose={() => onClose(null)} {...DIALOG}>
      <DialogTitle>Robot information</DialogTitle>
      <DialogContent>
        <DialogContentText>Type the address of the new robot</DialogContentText>
        <div style={{ display: "flex", gap: 16 }}>
          <TextField
            label="Robot host address"
            placeholder="localhost, 10.0.0.1, my.robot.com"
            variant="standard"
            margin="normal"
            sx={{ flex: 7 }}
            value={host}
            onChange={(event) => setHost(event.target.value)}
          />
          <TextField
            label="Rosie WebHUD port"
            placeholder="5000, 8080"
            type="number"
            variant="standard"
            margin="normal"
            sx={{ flex: 3 }}
            value={port}
            onChange={(event) => setPort(event.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button disabled={!(host && port)} onClick={() => onClose({ host, port: Number(port) })}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
