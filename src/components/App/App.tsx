"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AlertCircle } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { speakText } from "../../utils/speakText";
import CameraFeed, { type CameraHandle } from "../CameraFeed";
import ControlPanel from "../ControlPanel";
import SwitchCameraButton from "../SwitchCameraButton";

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false); // Used for loading state now
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );

  const cameraRef = useRef<CameraHandle>(null);

  const analyzeFrame = useCallback(async () => {
    if (
      !process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      !cameraRef.current ||
      isAnalyzing
    )
      return;

    const base64Image = cameraRef.current.captureFrame();
    if (!base64Image) return;

    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      );
      let model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt =
        "Answer as short as possible the question. If there are more than one question, answer the one which is pointed. Just answer '' if you don't read any questions. Answer always in Spanish and, if the question is a test question, just answer the correct letter.";
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      };

      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        if (text) speakText(text);
        setError(null);
      } catch (firstErr) {
        console.warn("Primary model failed, trying fallback:", firstErr);
        if (
          firstErr instanceof Error &&
          (firstErr.message.includes("503") || firstErr.message.includes("429"))
        ) {
          // Fallback to stable model
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          const result = await model.generateContent([prompt, imagePart]);
          const response = await result.response;
          const text = response.text();

          if (text) speakText(text);
          setError(null);
        } else {
          throw firstErr;
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

  if (error)
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
        <AlertCircle className="shrink-0" />
        <p>{error} </p>
        <button
          onClick={() => setError(null)}
          className="ml-auto text-sm hover:underline"
        >
          Dismiss
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen w-full bg-slate-900 font-sans text-slate-50">
      <div className="flex h-full w-full">
        <CameraFeed
          ref={cameraRef}
          isActive={true} // Keep camera active to allow setting up shot before analyzing
          onStreamReady={() => {}}
          onError={(err) => setError(err)}
          facingMode={facingMode}
        />
      </div>
      <SwitchCameraButton
        switchCamera={() =>
          setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
        }
      />
      <ControlPanel
        apiKey={process.env.NEXT_PUBLIC_GEMINI_API_KEY}
        isAnalyzing={isAnalyzing}
        onAnalyze={analyzeFrame}
      />
    </div>
  );
}
