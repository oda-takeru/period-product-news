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

  // NewsAPI で記事収集（失敗しても次に進む）
  try {
    console.log("=== NewsAPI 記事収集開始 ===");
    results.newsapi.count = await collectFromNewsAPI();
    console.log(`NewsAPI: ${results.newsapi.count} 件取得`);
  } catch (error) {
    results.newsapi.error =
      error instanceof Error ? error.message : String(error);
    console.error("NewsAPI 収集エラー:", error);
  }

  // スクレイピングで記事収集（失敗しても結果を返す）
  try {
    console.log("=== スクレイピング記事収集開始 ===");
    results.scraping.count = await collectFromScraping();
    console.log(`スクレイピング: ${results.scraping.count} 件取得`);
  } catch (error) {
    results.scraping.error =
      error instanceof Error ? error.message : String(error);
    console.error("スクレイピング収集エラー:", error);
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
