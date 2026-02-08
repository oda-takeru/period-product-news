import "dotenv/config";
import { collectFromNewsAPI } from "../src/lib/collectors/news-api";
import { collectFromScraping } from "../src/lib/collectors/scraper";

async function main() {
  console.log("=== 記事収集バッチ開始 ===");
  console.log(`実行日時: ${new Date().toISOString()}`);

  console.log("\n--- NewsAPI から収集中 ---");
  const newsCount = await collectFromNewsAPI();
  console.log(`NewsAPI: ${newsCount} 件収集`);

  console.log("\n--- Webスクレイピングで収集中 ---");
  const scrapeCount = await collectFromScraping();
  console.log(`スクレイピング: ${scrapeCount} 件収集`);

  console.log(`\n=== 収集完了: 合計 ${newsCount + scrapeCount} 件 ===`);
  process.exit(0);
}

main().catch((error) => {
  console.error("バッチ実行エラー:", error);
  process.exit(1);
});
