"use client";

import ArticleCard from "./ArticleCard";

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

interface ArticleListProps {
  articles: Article[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export default function ArticleList({
  articles,
  isFavorite,
  onToggleFavorite,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-gray-500 text-lg">記事が見つかりませんでした</p>
        <p className="text-gray-400 text-sm mt-2">
          フィルタを変更するか、記事収集バッチを実行してください
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          isFavorite={isFavorite(article.id)}
          onToggleFavorite={() => onToggleFavorite(article.id)}
        />
      ))}
    </div>
  );
}
