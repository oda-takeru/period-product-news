"use client";

import { useState, useCallback, useEffect } from "react";

export type Language = "original" | "ja";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved === "original" || saved === "ja") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "ja" ? "original" : "ja";
      localStorage.setItem("preferredLanguage", next);
      return next;
    });
  }, []);

  return { language, setLanguage, toggleLanguage };
}
