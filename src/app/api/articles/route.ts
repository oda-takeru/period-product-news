import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country");
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const ids = searchParams.get("ids");

  const where: Record<string, unknown> = {};

  if (ids) {
    where.id = { in: ids.split(",") };
  }

  if (country) {
    const countries = country.split(",");
    where.country = countries.length === 1 ? countries[0] : { in: countries };
  }

  if (brand) {
    const brands = brand.split(",");
    where.brand = brands.length === 1 ? brands[0] : { in: brands };
  }

  if (category && category !== "all") {
    where.category = category;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { titleJa: { contains: q } },
      { summaryJa: { contains: q } },
      { brand: { contains: q } },
      { company: { contains: q } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  const brands = await prisma.article.findMany({
    where: { brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });

  const companies = await prisma.article.findMany({
    where: { company: { not: null } },
    select: { company: true },
    distinct: ["company"],
    orderBy: { company: "asc" },
  });

  const countriesInDb = await prisma.article.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  return NextResponse.json({
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    filters: {
      brands: brands.map((b) => b.brand).filter(Boolean),
      companies: companies.map((c) => c.company).filter(Boolean),
      countries: countriesInDb.map((c) => c.country),
    },
  });
}
