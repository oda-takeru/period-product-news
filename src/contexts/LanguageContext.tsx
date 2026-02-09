"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLanguage, Language } from "@/hooks/useLanguage";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ja",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language, toggleLanguage } = useLanguage();
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  return useContext(LanguageContext);
}
