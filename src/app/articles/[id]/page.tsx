"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { COUNTRIES, COUNTRY_FLAGS, CATEGORIES } from "@/lib/constants";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  country: string;
  brand: string | null;
  company: string | null;
  category: string;
  source: string;
  publishedAt: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles?ids=${params.id}`);
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticle(data.articles[0]);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-gray-500 mt-4">読み込み中...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">404</p>
        <p className="text-gray-500 text-lg">記事が見つかりませんでした</p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  const date = new Date(article.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 transition-colors mb-6"
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
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        記事一覧に戻る
      </Link>

      {/* Image */}
      {article.imageUrl && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gray-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
          {COUNTRY_FLAGS[article.country]}{" "}
          {COUNTRIES[article.country] || article.country}
        </span>
        {article.category !== "general" && (
          <span className="px-3 py-1 bg-pink-100 rounded-full text-sm text-pink-700">
            {CATEGORIES[article.category] || article.category}
          </span>
        )}
        {article.brand && (
          <span className="px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700">
            {article.brand}
          </span>
        )}
        {article.company && (
          <span className="text-sm text-gray-400">{article.company}</span>
        )}
      </div>

      {/* Title */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {article.title}
        </h1>
        <FavoriteButton
          isFavorite={isFavorite(article.id)}
          onToggle={() => toggleFavorite(article.id)}
        />
      </div>

      <p className="text-sm text-gray-400 mb-6">{date}</p>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          {article.summary}
        </p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* Source link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors text-sm font-medium"
        >
          元記事を読む
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
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
        <p className="text-xs text-gray-400 mt-2">
          収集元: {article.source === "newsapi" ? "NewsAPI" : "Webスクレイピング"}
        </p>
      </div>
    </div>
  );
}
