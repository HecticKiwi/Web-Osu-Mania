import { useEffect, useRef } from "react";

const PreviewProgressBar = ({ preview }: { preview: Howl }) => {
  const barRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const currentBarRef = barRef.current;

    if (!preview) {
      currentBarRef.style.transform = "scaleX(0)";
      return;
    }

    let animationFrame: number;
    const updateProgress = () => {
      const currentProgress = preview.seek() / preview.duration();
      currentBarRef.style.transform = `scaleX(${currentProgress})`;
      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    return () => {
      cancelAnimationFrame(animationFrame);
      currentBarRef.style.transform = "scaleX(0)";
    };
  }, [preview]);

  return (
    <div
      ref={barRef}
      className="bg-primary h-1 origin-left"
      style={{ transform: "scaleX(0)" }}
    />
  );
};

export default PreviewProgressBar;
