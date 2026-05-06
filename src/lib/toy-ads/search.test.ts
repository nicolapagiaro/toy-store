import { describe, expect, it, vi } from "vitest";
import { buildPrismaSearchWhere, searchToyAds } from "./search";
import type { ToyAdSearchResult } from "./search";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeToyAd(overrides: Partial<ToyAdSearchResult> = {}): ToyAdSearchResult {
  return {
    id: "ad-1",
    title: "Lego City",
    description: "Set completo",
    ageRange: "AGE_6_8",
    condition: "GOOD",
    city: "Milano",
    district: null,
    imagePaths: [],
    createdAt: new Date("2024-01-01"),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// describe: buildPrismaSearchWhere
// ---------------------------------------------------------------------------

describe("buildPrismaSearchWhere", () => {
  it("nessun parametro → solo { status: 'PUBLISHED' }", () => {
    const where = buildPrismaSearchWhere({});

    expect(where).toEqual({ status: "PUBLISHED" });
    expect(where).not.toHaveProperty("OR");
    expect(where).not.toHaveProperty("ageRange");
  });

  it("solo query → include OR su title/description con mode insensitive, niente ageRange", () => {
    const where = buildPrismaSearchWhere({ query: "trenino" });

    expect(where.status).toBe("PUBLISHED");
    expect(where).not.toHaveProperty("ageRange");
    expect(where.OR).toEqual([
      { title: { contains: "trenino", mode: "insensitive" } },
      { description: { contains: "trenino", mode: "insensitive" } },
    ]);
  });

  it("solo ageRange valido ('AGE_3_5') → include ageRange, niente OR", () => {
    const where = buildPrismaSearchWhere({ ageRange: "AGE_3_5" });

    expect(where.status).toBe("PUBLISHED");
    expect(where.ageRange).toBe("AGE_3_5");
    expect(where).not.toHaveProperty("OR");
  });

  it("query + ageRange → include entrambi", () => {
    const where = buildPrismaSearchWhere({ query: "bici", ageRange: "AGE_6_8" });

    expect(where.status).toBe("PUBLISHED");
    expect(where.ageRange).toBe("AGE_6_8");
    expect(where.OR).toEqual([
      { title: { contains: "bici", mode: "insensitive" } },
      { description: { contains: "bici", mode: "insensitive" } },
    ]);
  });

  it("query con solo spazi → trattata come assente (nessun OR nel where)", () => {
    const where = buildPrismaSearchWhere({ query: "   " });

    expect(where).toEqual({ status: "PUBLISHED" });
    expect(where).not.toHaveProperty("OR");
  });

  it("ageRange non valido ('INVALID') → ignorato (niente ageRange nel where)", () => {
    const where = buildPrismaSearchWhere({ ageRange: "INVALID" });

    expect(where).toEqual({ status: "PUBLISHED" });
    expect(where).not.toHaveProperty("ageRange");
    expect(where).not.toHaveProperty("OR");
  });

  it("ageRange non valido + query valida → include OR ma non ageRange", () => {
    const where = buildPrismaSearchWhere({ query: "pupazzo", ageRange: "INVALID" });

    expect(where.status).toBe("PUBLISHED");
    expect(where).not.toHaveProperty("ageRange");
    expect(where.OR).toEqual([
      { title: { contains: "pupazzo", mode: "insensitive" } },
      { description: { contains: "pupazzo", mode: "insensitive" } },
    ]);
  });
});

// ---------------------------------------------------------------------------
// describe: searchToyAds
// ---------------------------------------------------------------------------

describe("searchToyAds", () => {
  it("chiama findAds con il where corretto per query + ageRange validi", async () => {
    const findAds = vi.fn(async () => []);

    await searchToyAds({ query: "moto", ageRange: "AGE_9_12" }, { findAds });

    expect(findAds).toHaveBeenCalledTimes(1);
    expect(findAds).toHaveBeenCalledWith({
      query: "moto",
      ageRange: "AGE_9_12",
    });
  });

  it("ritorna i risultati di findAds invariati", async () => {
    const ads = [makeToyAd({ id: "ad-42", title: "Moto telecomandata" })];
    const findAds = vi.fn(async () => ads);

    const result = await searchToyAds({ query: "moto" }, { findAds });

    expect(result).toBe(ads);
  });

  it("con ageRange non valido, chiama findAds senza filtro ageRange (normalizzazione applicata)", async () => {
    const findAds = vi.fn(async () => []);

    await searchToyAds({ query: "trenino", ageRange: "INVALID" }, { findAds });

    expect(findAds).toHaveBeenCalledWith({
      query: "trenino",
      ageRange: undefined,
    });
  });

  it("query vuota dopo trim → chiama findAds senza OR", async () => {
    const findAds = vi.fn(async () => []);

    await searchToyAds({ query: "   " }, { findAds });

    expect(findAds).toHaveBeenCalledWith({
      query: undefined,
      ageRange: undefined,
    });
  });
});
