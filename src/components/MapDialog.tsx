import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

import { connection } from "../robots";
import { useAppSelector } from "../store";
import { DIALOG } from "./dialogs";

interface MapChoice {
  name: string;
  robot: string; // robot name
  address: string; // host:port, which is also the robot's id
}

interface Props {
  open: boolean;
  onClose: (choice: MapChoice | null) => void;
}

// every map of every robot, to show one and plan that robot's routes on it
export function MapDialog({ open, onClose }: Props) {
  const robots = useAppSelector((state) => state.robots.list);
  const [maps, setMaps] = useState<MapChoice[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    let current = true;
    void Promise.all(
      robots.map(async (robot) => {
        const response = await connection(robot.id)?.maps().catch(() => null);
        return (response?.maps ?? []).map((name) => ({ name, robot: robot.name, address: robot.id }));
      }),
    ).then((lists) => {
      if (current) {
        setMaps(lists.flat());
        setChosen(null);
      }
    });
    return () => {
      current = false;
    };
  }, [open, robots]);

  const choice = chosen === null ? null : (maps[chosen] ?? null);
  return (
    <Dialog open={open} onClose={() => onClose(null)} {...DIALOG}>
      <DialogTitle>Map Select</DialogTitle>
      <DialogContent>
        <DialogContentText>Select the map to load in the application</DialogContentText>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Name</TableCell>
              <TableCell>Robot</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maps.map((map, index) => (
              <TableRow key={`${map.address}/${map.name}`} hover selected={index === chosen} onClick={() => setChosen(index)} sx={{ cursor: "pointer" }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={index === chosen} />
                </TableCell>
                <TableCell>{map.name}</TableCell>
                <TableCell>{map.robot}</TableCell>
                <TableCell>{map.address}</TableCell>
              </TableRow>
            ))}
            {maps.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No maps available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button disabled={!choice} onClick={() => onClose(choice)}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
