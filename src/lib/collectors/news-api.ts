import axios from "axios";
import { prisma } from "../db";
import { SEARCH_KEYWORDS } from "../constants";
import { translateArticle } from "../translate";

interface NewsAPIArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

function detectBrandAndCompany(text: string): {
  brand: string | null;
  company: string | null;
} {
  const brandMap: Record<string, { brand: string | null; company: string | null }> = {
    laurier: { brand: "ロリエ", company: "花王" },
    ロリエ: { brand: "ロリエ", company: "花王" },
    sofy: { brand: "ソフィ", company: "ユニ・チャーム" },
    ソフィ: { brand: "ソフィ", company: "ユニ・チャーム" },
    always: { brand: "Always", company: "P&G" },
    whisper: { brand: "Whisper", company: "P&G" },
    thinx: { brand: "Thinx", company: "Thinx Inc." },
    modibodi: { brand: "Modibodi", company: "Modibodi" },
    kotex: { brand: "Kotex", company: "Kimberly-Clark" },
    stayfree: { brand: "Stayfree", company: "Johnson & Johnson" },
    nana: { brand: "Nana", company: "Essity" },
    bodyform: { brand: "Bodyform", company: "Essity" },
    libresse: { brand: "Libresse", company: "Essity" },
    elis: { brand: "エリス", company: "大王製紙" },
    エリス: { brand: "エリス", company: "大王製紙" },
    "center-in": { brand: "センターイン", company: "ユニ・チャーム" },
    センターイン: { brand: "センターイン", company: "ユニ・チャーム" },
    "be-a": { brand: "Bé-A", company: "Bé-A Japan" },
    nagi: { brand: "Nagi", company: "BLAST Inc." },
    period: { brand: null, company: null },
  };

  const lowerText = text.toLowerCase();
  for (const [keyword, info] of Object.entries(brandMap)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return info;
    }
  }
  return { brand: null, company: null };
}

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes("underwear") ||
    lowerText.includes("panties") ||
    lowerText.includes("ショーツ") ||
    lowerText.includes("shorts")
  ) {
    return "underwear";
  }
  if (
    lowerText.includes("pad") ||
    lowerText.includes("napkin") ||
    lowerText.includes("ナプキン") ||
    lowerText.includes("パッド")
  ) {
    return "pad";
  }
  return "general";
}

export async function collectFromNewsAPI(): Promise<number> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.log("NEWS_API_KEY is not set. Skipping NewsAPI collection.");
    return 0;
  }

  let totalCollected = 0;

  // NewsAPI /v2/everything は language パラメータのみ対応
  // 言語ごとにまとめてリクエスト（日本語 + 英語）し、API呼び出し数を削減
  const LANG_COUNTRY_MAP: Record<string, string[]> = {
    ja: ["JP"],
    en: ["US", "GB", "AU", "CA", "IN"],
    fr: ["FR"],
    de: ["DE"],
  };

  for (const [lang, countries] of Object.entries(LANG_COUNTRY_MAP)) {
    for (const keyword of SEARCH_KEYWORDS.slice(0, 2)) {
      try {
        const response = await axios.get<NewsAPIResponse>(
          "https://newsapi.org/v2/everything",
          {
            params: {
              q: keyword,
              language: lang,
              sortBy: "publishedAt",
              pageSize: 10,
              apiKey,
            },
            timeout: 10000,
          }
        );

        if (response.data.status !== "ok") continue;

        for (const article of response.data.articles) {
          if (!article.title || !article.url) continue;

          const fullText = `${article.title} ${article.description || ""} ${article.content || ""}`;
          const { brand, company } = detectBrandAndCompany(fullText);
          const category = detectCategory(fullText);

          // 言語から代表国を割り当て
          const country = countries[0];

          try {
            // 既存記事はスキップ
            const existing = await prisma.article.findUnique({
              where: { url: article.url },
              select: { id: true },
            });
            if (existing) continue;

            // 新規記事のみ翻訳して保存
            const articleTitle = article.title;
            const articleSummary = article.description || article.title;
            const articleContent = article.content || article.description || "";

            const { titleJa, summaryJa, contentJa } = await translateArticle(
              articleTitle,
              articleSummary,
              articleContent
            );

            await prisma.article.create({
              data: {
                title: articleTitle,
                summary: articleSummary,
                content: articleContent,
                titleJa,
                summaryJa,
                contentJa,
                url: article.url,
                imageUrl: article.urlToImage,
                country,
                brand,
                company,
                category,
                source: "newsapi",
                publishedAt: new Date(article.publishedAt),
              },
            });
            totalCollected++;
          } catch {
            // duplicate URL or other error, skip
          }
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `Error fetching news for ${lang}/${keyword}:`,
          error
        );
      }
    }
  }

  return totalCollected;
}
