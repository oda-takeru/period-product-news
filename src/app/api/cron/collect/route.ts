import { NextRequest, NextResponse } from "next/server";
import { collectFromNewsAPI } from "@/lib/collectors/news-api";
import { collectFromScraping } from "@/lib/collectors/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // CRON_SECRET による認証
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const results: {
    newsapi: { count: number; error: string | null };
    scraping: { count: number; error: string | null };
  } = {
    newsapi: { count: 0, error: null },
    scraping: { count: 0, error: null },
  };

  // NewsAPI とスクレイピングを並列実行（タイムアウト対策）
  console.log("=== 記事収集開始（並列実行）===");

  const [newsapiResult, scrapingResult] = await Promise.allSettled([
    collectFromNewsAPI(),
    collectFromScraping(),
  ]);

  if (newsapiResult.status === "fulfilled") {
    results.newsapi.count = newsapiResult.value;
    console.log(`NewsAPI: ${results.newsapi.count} 件取得`);
  } else {
    results.newsapi.error = newsapiResult.reason?.message || String(newsapiResult.reason);
    console.error("NewsAPI 収集エラー:", newsapiResult.reason);
  }

  if (scrapingResult.status === "fulfilled") {
    results.scraping.count = scrapingResult.value;
    console.log(`スクレイピング: ${results.scraping.count} 件取得`);
  } else {
    results.scraping.error = scrapingResult.reason?.message || String(scrapingResult.reason);
    console.error("スクレイピング収集エラー:", scrapingResult.reason);
  }

  const duration = Date.now() - startTime;
  const totalCollected = results.newsapi.count + results.scraping.count;
  const allFailed =
    results.newsapi.error !== null && results.scraping.error !== null;

  console.log(
    `=== 収集完了: ${totalCollected} 件（${duration}ms）===`
  );

  return NextResponse.json(
    {
      success: !allFailed,
      collected: totalCollected,
      results,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    },
    { status: allFailed ? 500 : 200 }
  );
}
