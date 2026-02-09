"use client";

import { Language } from "@/hooks/useLanguage";

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export default function LanguageToggle({
  language,
  onToggle,
}: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
        bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      title={language === "ja" ? "原文を表示" : "日本語訳を表示"}
    >
      {language === "ja" ? "🌐 原文" : "🇯🇵 日本語"}
    </button>
  );
}
