import { useEffect, useState } from "react";

const PreviewProgressBar = ({ preview }: { preview: Howl }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let animationFrame: number;

    const updateProgress = () => {
      if (preview) {
        const currentProgress = preview.seek() / preview.duration();

        setProgress(currentProgress);
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    if (preview) {
      updateProgress();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      setProgress(0);
    };
  }, [preview]);

  return (
    <div
      className="h-1 origin-left bg-primary"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
};

export default PreviewProgressBar;
