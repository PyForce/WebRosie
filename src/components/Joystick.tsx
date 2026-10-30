import nipplejs from "nipplejs";
import { useEffect, useRef } from "react";

import { useAppDispatch } from "../store";
import { joystick } from "../store/thunks";
import { colors } from "../theme";

// on-screen joystick for user mode on touch screens
export function Joystick() {
  const dispatch = useAppDispatch();
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zone.current) {
      return;
    }
    const manager = nipplejs.create({
      zone: zone.current,
      mode: "static",
      color: colors.primary,
      position: { top: "50%", left: "50%" },
    });
    manager.on("move", ({ data }) => {
      const force = Math.min(data.force, 1);
      dispatch(joystick(force * Math.cos(data.angle.radian), force * Math.sin(data.angle.radian)));
    });
    manager.on("end", () => dispatch(joystick(0, 0)));
    return () => manager.destroy();
  }, [dispatch]);

  return <div className="joystick-zone" ref={zone} />;
}
