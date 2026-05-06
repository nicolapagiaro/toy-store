import type { ToyAdAgeRange } from "@prisma/client";

export type SearchToyAdsParams = {
  query?: string;
  ageRange?: string;
};

export type ToyAdSearchResult = {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  condition: string;
  city: string;
  district: string | null;
  imagePaths: string[];
  createdAt: Date;
};

const VALID_AGE_RANGES: ToyAdAgeRange[] = ["AGE_0_2", "AGE_3_5", "AGE_6_8", "AGE_9_12"];

function isValidAgeRange(value: string): value is ToyAdAgeRange {
  return VALID_AGE_RANGES.includes(value as ToyAdAgeRange);
}

type NormalizedSearchParams = {
  query: string | undefined;
  ageRange: ToyAdAgeRange | undefined;
};

function normalizeSearchParams(params: SearchToyAdsParams): NormalizedSearchParams {
  const query = params.query?.trim() || undefined;
  const ageRange =
    params.ageRange && isValidAgeRange(params.ageRange) ? params.ageRange : undefined;

  return { query, ageRange };
}

export type PrismaSearchWhere = {
  status: "PUBLISHED";
  ageRange?: ToyAdAgeRange;
  OR?: Array<{
    title?: { contains: string; mode: "insensitive" };
    description?: { contains: string; mode: "insensitive" };
  }>;
};

export function buildPrismaSearchWhere(params: SearchToyAdsParams): PrismaSearchWhere {
  const { query, ageRange } = normalizeSearchParams(params);

  return {
    status: "PUBLISHED",
    ...(ageRange !== undefined && { ageRange }),
    ...(query !== undefined && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
  };
}

type SearchToyAdsDependencies = {
  findAds: (params: NormalizedSearchParams) => Promise<ToyAdSearchResult[]>;
};

export async function searchToyAds(
  params: SearchToyAdsParams,
  dependencies: SearchToyAdsDependencies
): Promise<ToyAdSearchResult[]> {
  const normalized = normalizeSearchParams(params);
  return dependencies.findAds(normalized);
}
