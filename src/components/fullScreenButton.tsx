"use client";

import { useEffect } from "react";

function FullscreenButton() {
  useEffect(() => {
    const handleFullscreenChange = () => {};

    addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  return (
    <>
      <div></div>
    </>
  );
}

export default FullscreenButton;
