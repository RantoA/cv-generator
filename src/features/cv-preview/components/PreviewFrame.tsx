import { forwardRef } from "react";
import type { Cv } from "@/types/cv.types";
import { CvRenderer } from "../templates/CvRenderer";
import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  cv: Cv;
  className?: string;
}

export const PreviewFrame = forwardRef<HTMLDivElement, PreviewFrameProps>(({ cv, className }, ref) => {
  return (
    <div className={cn("mx-auto w-full max-w-[820px]", className)}>
      <CvRenderer ref={ref} cv={cv} />
    </div>
  );
});
PreviewFrame.displayName = "PreviewFrame";
