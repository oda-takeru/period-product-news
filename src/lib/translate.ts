import { translate } from "@vitalets/google-translate-api";

interface TranslationResult {
  titleJa: string | null;
  summaryJa: string | null;
  contentJa: string | null;
}

/**
 * テキストが日本語かどうかを判定（30%以上日本語文字なら日本語とみなす）
 */
function isJapanese(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  const japaneseChars = (
    text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []
  ).length;
  return japaneseChars / text.length > 0.3;
}

/**
 * テキストを日本語に翻訳。すでに日本語の場合はそのまま返す。
 */
async function translateText(text: string): Promise<string | null> {
  if (!text || text.trim().length === 0) return null;
  if (isJapanese(text)) return text;

  try {
    const result = await translate(text, { to: "ja" });
    return result.text;
  } catch (error) {
    console.error("翻訳エラー:", error);
    return null;
  }
}

/**
 * 記事のタイトル・要約・本文を日本語に翻訳する。
 * レート制限のため各フィールド間に200msの遅延を入れる。
 */
export async function translateArticle(
  title: string,
  summary: string,
  content: string
): Promise<TranslationResult> {
  // タイトルと要約のみ翻訳（本文はタイムアウト対策で省略、要約で十分）
  const titleJa = await translateText(title);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const summaryJa = await translateText(summary);

  // 本文は500文字に制限して翻訳
  await new Promise((resolve) => setTimeout(resolve, 100));
  const truncatedContent =
    content.length > 500 ? content.substring(0, 500) + "..." : content;
  const contentJa = await translateText(truncatedContent);

  return { titleJa, summaryJa, contentJa };
}
