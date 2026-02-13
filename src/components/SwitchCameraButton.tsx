import { SwitchCamera } from "lucide-react";

interface SwitchCameraButtonProps {
  onClick: () => void;
}

export default function SwitchCameraButton({
  onClick,
}: SwitchCameraButtonProps) {
  return (
    <button
      className="absolute top-5 right-10 rounded-full bg-white/10 p-3 hover:bg-white/20"
      onClick={onClick}
    >
      <SwitchCamera />
    </button>
  );
}
