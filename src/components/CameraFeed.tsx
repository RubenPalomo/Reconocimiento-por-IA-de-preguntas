import { CameraOff } from "lucide-react";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface CameraFeedProps {
  isActive: boolean;
  onStreamReady: (stream: MediaStream) => void;
  onError: (error: string) => void;
}

export interface CameraHandle {
  captureFrame: () => string | null;
}

const CameraFeed = forwardRef<CameraHandle, CameraFeedProps>(
  ({ isActive, onStreamReady, onError }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useImperativeHandle(ref, () => ({
      captureFrame: () => {
        const video = videoRef.current;
        if (!video) {
          console.log("captureFrame: No video ref");
          return null;
        }

        if (video.readyState !== 4) {
          // HAVE_ENOUGH_DATA
          console.log("captureFrame: Video not ready", video.readyState);
          // Try to capture anyway if we have some data, but usually 4 is best.
          // If 0, definitely return null
          if (video.readyState === 0) return null;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (canvas.width === 0 || canvas.height === 0) {
          console.log("captureFrame: Video dimensions are 0");
          return null;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.log("captureFrame: No context");
          return null;
        }

        ctx.drawImage(video, 0, 0);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          return dataUrl.split(",")[1];
        } catch (e) {
          console.error("captureFrame: Error creating data URL", e);
          return null;
        }
      },
    }));

    useEffect(() => {
      let mounted = true;

      const startCamera = async () => {
        try {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment", // Prefer back camera on mobile
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });

          if (!mounted) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          onStreamReady(stream);
        } catch (err) {
          if (mounted) {
            console.error("Camera access error:", err);
            onError(
              err instanceof Error ? err.message : "Failed to access camera",
            );
          }
        }
      };

      if (isActive) {
        startCamera();
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }

      return () => {
        mounted = false;
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };
    }, [isActive, onStreamReady, onError]);

    return (
      <div className="relative aspect-video h-screen w-full rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <CameraOff size={48} />
            <p className="mt-2 text-sm">Camera is off</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {isActive ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />{" "}
              LIVE
            </span>
          ) : (
            "OFFLINE"
          )}
        </div>
      </div>
    );
  },
);

CameraFeed.displayName = "CameraFeed";

export default CameraFeed;
