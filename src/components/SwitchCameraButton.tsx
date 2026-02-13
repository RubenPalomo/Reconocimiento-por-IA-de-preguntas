import { SwitchCamera } from "lucide-react";

export default function SwitchCameraButton({
  switchCamera,
}: {
  switchCamera: () => void;
}) {
  return (
    <button
      className="absolute right-6 bottom-6 rounded-full bg-white/10 p-3 hover:bg-white/20"
      onClick={switchCamera}
    >
      <SwitchCamera />
    </button>
  );
}
