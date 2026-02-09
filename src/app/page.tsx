"use client";

import { useState, useEffect, useCallback } from "react";
import ArticleList from "@/components/ArticleList";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useFilters } from "@/hooks/useFilters";

interface Article {
  id: string;
  title: string;
  summary: string;
  titleJa?: string | null;
  summaryJa?: string | null;
  url: string;
  imageUrl: string | null;
  country: string;
  brand: string | null;
  company: string | null;
  category: string;
  publishedAt: string;
}

interface APIResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    brands: string[];
    companies: string[];
    countries: string[];
  };
}

export default function HomePage() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    filters,
    toggleCountry,
    toggleBrand,
    setCategory,
    setQuery,
    clearFilters,
  } = useFilters();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.countries.length > 0)
      params.set("country", filters.countries.join(","));
    if (filters.brands.length > 0)
      params.set("brand", filters.brands.join(","));
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.query) params.set("q", filters.query);
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/articles?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">{today}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          今日の生理用品ニュース
        </h2>
        <p className="text-gray-500 mt-2">
          世界各国の最新の生理用品・吸水ショーツ情報をお届けします
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={filters.query} onChange={setQuery} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          フィルタ
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <div className="hidden sm:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              availableBrands={data?.filters.brands || []}
              availableCountries={data?.filters.countries || []}
              onToggleCountry={toggleCountry}
              onToggleBrand={toggleBrand}
              onSetCategory={setCategory}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Sidebar - Mobile */}
        {showFilters && (
          <div className="sm:hidden fixed inset-0 z-40 bg-black/50">
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">フィルタ</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                availableBrands={data?.filters.brands || []}
                availableCountries={data?.filters.countries || []}
                onToggleCountry={toggleCountry}
                onToggleBrand={toggleBrand}
                onSetCategory={setCategory}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
              <p className="text-gray-500 mt-4">記事を読み込み中...</p>
            </div>
          ) : (
            <>
              {data && (
                <p className="text-sm text-gray-400 mb-4">
                  {data.total} 件の記事
                </p>
              )}
              <ArticleList
                articles={data?.articles || []}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    前へ
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-500">
                    {page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page === data.totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    次へ
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
