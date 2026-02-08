"use client";

import { COUNTRIES, COUNTRY_FLAGS, CATEGORIES } from "@/lib/constants";
import type { Filters } from "@/hooks/useFilters";

interface FilterSidebarProps {
  filters: Filters;
  availableBrands: string[];
  availableCountries: string[];
  onToggleCountry: (code: string) => void;
  onToggleBrand: (brand: string) => void;
  onSetCategory: (category: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  filters,
  availableBrands,
  availableCountries,
  onToggleCountry,
  onToggleBrand,
  onSetCategory,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.countries.length > 0 ||
    filters.brands.length > 0 ||
    filters.category !== "all";

  return (
    <aside className="space-y-6">
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 transition-colors"
        >
          フィルタをクリア
        </button>
      )}

      {/* カテゴリ */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">カテゴリ</h3>
        <div className="space-y-1">
          <button
            onClick={() => onSetCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              filters.category === "all"
                ? "bg-pink-100 text-pink-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            すべて
          </button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onSetCategory(key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === key
                  ? "bg-pink-100 text-pink-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 国 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">国</h3>
        <div className="space-y-1">
          {availableCountries.map((code) => (
            <button
              key={code}
              onClick={() => onToggleCountry(code)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                filters.countries.includes(code)
                  ? "bg-pink-100 text-pink-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{COUNTRY_FLAGS[code] || "🌍"}</span>
              <span>{COUNTRIES[code] || code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ブランド */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">ブランド</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {availableBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => onToggleBrand(brand)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.brands.includes(brand)
                    ? "bg-pink-100 text-pink-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
