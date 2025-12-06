import type { ReactNode } from "react";

import { createContext, useCallback, useContext, useState } from "react";

interface ProcessingContextValue {
  isProcessing: boolean;
  processingMessage: string;
  setProcessing: (processing: boolean, message?: string) => void;
}

const ProcessingContext = createContext<ProcessingContextValue | null>(null);

export function ProcessingProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const setProcessing = useCallback((processing: boolean, message = "") => {
    setIsProcessing(processing);
    setProcessingMessage(message);
  }, []);

  return (
    <ProcessingContext.Provider value={{ isProcessing, processingMessage, setProcessing }}>{children}</ProcessingContext.Provider>
  );
}

export function useProcessing(): ProcessingContextValue {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error("useProcessing must be used within a ProcessingProvider");
  }
  return context;
}
