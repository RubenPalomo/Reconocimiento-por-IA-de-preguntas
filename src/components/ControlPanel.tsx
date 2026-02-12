import { Play } from "lucide-react";

interface ControlPanelProps {
  apiKey: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const ControlPanel = ({
  apiKey,
  isAnalyzing,
  onAnalyze,
}: ControlPanelProps) => {
  const disabled = !apiKey || isAnalyzing;

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] w-46 -translate-x-1/2">
      <button
        onClick={onAnalyze}
        disabled={disabled}
        className={`w-full rounded-full py-5 text-lg font-semibold shadow-xl transition-all duration-200 ${
          !disabled
            ? "bg-emerald-400 text-white shadow-emerald-500/30 hover:bg-emerald-500 active:scale-95"
            : "bg-gray-600 text-black"
        } `}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Analyzing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Play
              size={22}
              fill="currentColor"
            />
            <span>Start Analysis</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
