"use client";

import React, { useState } from "react";
import RedirectToLinkedIn from "./redirect_to_linkedin";

const UnderConstruction = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className="text-6xl cursor-pointer mb-4 animate-bounce"
        style={{ animationPlayState: isPressed ? "paused" : "running" }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        🚧
      </div>

      <div className="text-xl font-bold text-white whitespace-nowrap">
        Under Construction
      </div>

      <RedirectToLinkedIn isPressed={isPressed} />
    </div>
  );
};

export default UnderConstruction;
