export const COUNTRIES: Record<string, string> = {
  JP: "日本",
  US: "アメリカ",
  GB: "イギリス",
  FR: "フランス",
  DE: "ドイツ",
  SE: "スウェーデン",
  IN: "インド",
  KR: "韓国",
  AU: "オーストラリア",
  CA: "カナダ",
};

export const COUNTRY_FLAGS: Record<string, string> = {
  JP: "🇯🇵",
  US: "🇺🇸",
  GB: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  SE: "🇸🇪",
  IN: "🇮🇳",
  KR: "🇰🇷",
  AU: "🇦🇺",
  CA: "🇨🇦",
};

export const CATEGORIES: Record<string, string> = {
  pad: "ナプキン・パッド",
  underwear: "吸水ショーツ",
  general: "総合",
};

export const SEARCH_KEYWORDS = [
  "menstrual pad",
  "sanitary pad",
  "period underwear",
  "period panties",
  "menstrual products",
  "sanitary napkin",
  "feminine hygiene",
  "生理用品",
  "ナプキン",
  "吸水ショーツ",
];

export const SCRAPE_TARGETS = [
  {
    name: "花王 ロリエ",
    url: "https://www.kao.co.jp/laurier/",
    company: "花王",
    brand: "ロリエ",
    country: "JP",
  },
  {
    name: "ユニ・チャーム ソフィ",
    url: "https://www.unicharm.co.jp/ja/brands/sofy.html",
    company: "ユニ・チャーム",
    brand: "ソフィ",
    country: "JP",
  },
  {
    name: "P&G Always",
    url: "https://always.com/",
    company: "P&G",
    brand: "Always",
    country: "US",
  },
  {
    name: "Thinx",
    url: "https://www.thinx.com/",
    company: "Thinx Inc.",
    brand: "Thinx",
    country: "US",
  },
  {
    name: "Modibodi",
    url: "https://www.modibodi.com/",
    company: "Modibodi",
    brand: "Modibodi",
    country: "AU",
  },
];
