import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanup() {
  console.log("=== サンプルデータ削除開始 ===");

  const countBefore = await prisma.article.count();
  console.log(`削除前の記事数: ${countBefore}`);

  // 全記事を削除（Cronで翻訳付き新記事を再収集する）
  const result = await prisma.article.deleteMany({});
  console.log(`${result.count} 件の記事を削除しました`);

  const countAfter = await prisma.article.count();
  console.log(`削除後の記事数: ${countAfter}`);

  await prisma.$disconnect();
  console.log("=== 完了 ===");
}

cleanup().catch((e) => {
  console.error(e);
  process.exit(1);
});
