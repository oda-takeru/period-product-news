import axios from "axios";
import * as cheerio from "cheerio";
import { prisma } from "../db";
import { SCRAPE_TARGETS } from "../constants";

interface ScrapedArticle {
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  country: string;
  brand: string | null;
  company: string | null;
  category: string;
}

async function scrapePage(
  target: (typeof SCRAPE_TARGETS)[0]
): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  try {
    const response = await axios.get(target.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PeriodProductNews/1.0; +https://example.com)",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Generic scraping: look for article-like elements
    const selectors = [
      "article",
      ".article",
      ".news-item",
      ".product-item",
      ".card",
      ".post",
      '[class*="article"]',
      '[class*="news"]',
      '[class*="product"]',
    ];

    for (const selector of selectors) {
      $(selector).each((_i, el) => {
        const $el = $(el);
        const title =
          $el.find("h1, h2, h3, .title, [class*='title']").first().text().trim() ||
          $el.find("a").first().text().trim();
        const summary =
          $el.find("p, .description, .summary, [class*='desc']").first().text().trim();
        const link = $el.find("a").first().attr("href");
        const image =
          $el.find("img").first().attr("src") ||
          $el.find("img").first().attr("data-src");

        if (!title || title.length < 5) return;

        let fullUrl = link || target.url;
        if (fullUrl.startsWith("/")) {
          const baseUrl = new URL(target.url);
          fullUrl = `${baseUrl.origin}${fullUrl}`;
        }

        articles.push({
          title,
          summary: summary || title,
          content: summary || title,
          url: fullUrl,
          imageUrl: image
            ? image.startsWith("http")
              ? image
              : `${new URL(target.url).origin}${image}`
            : null,
          country: target.country,
          brand: target.brand,
          company: target.company,
          category: title.toLowerCase().includes("ショーツ") ||
            title.toLowerCase().includes("underwear")
            ? "underwear"
            : "pad",
        });
      });

      if (articles.length > 0) break;
    }
  } catch (error) {
    console.error(`Error scraping ${target.name}:`, error);
  }

  return articles;
}

export async function collectFromScraping(): Promise<number> {
  let totalCollected = 0;

  for (const target of SCRAPE_TARGETS) {
    console.log(`Scraping: ${target.name} (${target.url})`);

    const articles = await scrapePage(target);
    console.log(`  Found ${articles.length} articles`);

    for (const article of articles) {
      try {
        await prisma.article.upsert({
          where: { url: article.url },
          update: {},
          create: {
            title: article.title,
            summary: article.summary,
            content: article.content,
            url: article.url,
            imageUrl: article.imageUrl,
            country: article.country,
            brand: article.brand,
            company: article.company,
            category: article.category,
            source: "scraping",
            publishedAt: new Date(),
          },
        });
        totalCollected++;
      } catch {
        // duplicate URL, skip
      }
    }

    // Rate limiting between sites
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return totalCollected;
}
