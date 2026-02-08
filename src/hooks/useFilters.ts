"use client";

import { useState, useCallback } from "react";

export interface Filters {
  countries: string[];
  brands: string[];
  category: string;
  query: string;
}

export function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    countries: [],
    brands: [],
    category: "all",
    query: "",
  });

  const toggleCountry = useCallback((code: string) => {
    setFilters((prev) => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? prev.countries.filter((c) => c !== code)
        : [...prev.countries, code],
    }));
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ countries: [], brands: [], category: "all", query: "" });
  }, []);

  return {
    filters,
    toggleCountry,
    toggleBrand,
    setCategory,
    setQuery,
    clearFilters,
  };
}
