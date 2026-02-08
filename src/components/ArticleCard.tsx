"use client";

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { COUNTRIES, COUNTRY_FLAGS, CATEGORIES } from "@/lib/constants";

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

interface ArticleCardProps {
  article: Article;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ArticleCard({
  article,
  isFavorite,
  onToggleFavorite,
}: ArticleCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/articles/${article.id}`}>
        <div className="aspect-[16/9] bg-gradient-to-br from-pink-50 to-rose-50 relative overflow-hidden">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {COUNTRY_FLAGS[article.country] || "🌍"}
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {COUNTRY_FLAGS[article.country]}{" "}
              {COUNTRIES[article.country] || article.country}
            </span>
            {article.category !== "general" && (
              <span className="px-2.5 py-1 bg-pink-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                {CATEGORIES[article.category] || article.category}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
              size="sm"
            />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              {article.brand && (
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  {article.brand}
                </span>
              )}
              {article.company && (
                <span className="text-gray-400">{article.company}</span>
              )}
            </div>
            <time>{date}</time>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-pink-500 hover:text-pink-700 font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          元記事を読む
        </a>
      </div>
    </div>
  );
}
