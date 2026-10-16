"use client";

import { useRef, useState } from "react";

// Hover-or-tap switch shared by the figures and the podium: a mouse hover turns it on while
// the pointer is over the element, a tap toggles it, and pressing and holding keeps it on
// until the finger lifts. A touch that turns into a scroll never toggles it.
export function useLightSwitch() {
  const [hovered, setHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const longPress = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    longPress.current = false;
    holdTimer.current = window.setTimeout(() => {
      longPress.current = true;
      setHeld(true);
    }, 300);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    window.clearTimeout(holdTimer.current);
    if (longPress.current) setHeld(false);
    else setToggled((t) => !t);
  };
  const onPointerCancel = () => {
    window.clearTimeout(holdTimer.current);
    setHeld(false);
  };

  return { on: hovered || toggled || held, toggled, setHovered, setToggled, onPointerDown, onPointerUp, onPointerCancel };
}
