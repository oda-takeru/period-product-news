"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";
import { useFavorites } from "@/hooks/useFavorites";

interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  country: string;
  brand: string | null;
  company: string | null;
  category: string;
  publishedAt: string;
}

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/articles?ids=${favorites.join(",")}`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          お気に入り
        </h2>
        <p className="text-gray-500 mt-2">
          保存した記事を見返すことができます
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">読み込み中...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">💝</p>
          <p className="text-gray-500 text-lg">お気に入りはまだありません</p>
          <p className="text-gray-400 text-sm mt-2">
            記事のハートアイコンをタップしてお気に入りに追加しましょう
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            記事を見る
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {articles.length} 件のお気に入り
          </p>
          <ArticleList
            articles={articles}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </>
      )}
    </div>
  );
}
