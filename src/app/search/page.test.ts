import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Module mocks ---

vi.mock("@/lib/prisma", () => ({
  prisma: {
    toyAd: {
      findMany: vi.fn(async () => []),
    },
  },
}));

const mockGetPublicUrl = vi.fn((p: string) => ({
  data: { publicUrl: `https://cdn.example.com/${p}` },
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    storage: {
      from: () => ({
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  })),
}));

// CSS modules return a Proxy so any class name access yields the key string
vi.mock("./search.module.css", () => ({
  default: new Proxy(
    {},
    { get: (_target, prop: string) => prop }
  ),
}));

// SearchForm is a client component — stub it to avoid next/navigation hooks
vi.mock("./search-form", () => ({
  SearchForm: () => null,
}));

// next/link is used in JSX — return a simple passthrough stub
vi.mock("next/link", () => ({
  default: ({ children }: { children: unknown }) => children,
}));

// --- Helpers ---

function makeAd(overrides: Record<string, unknown> = {}) {
  return {
    id: "ad-1",
    title: "Triciclo",
    description: "Poco usato",
    ageRange: "AGE_3_5",
    condition: "GOOD",
    city: "Milano",
    district: null,
    imagePaths: [],
    createdAt: new Date("2024-01-01"),
    ...overrides,
  };
}

// --- Tests ---

describe("SearchPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("restituisce risultati quando Prisma trova annunci", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([
      makeAd({ id: "ad-1", title: "Triciclo" }),
      makeAd({ id: "ad-2", title: "Lego City" }),
    ] as never);

    await SearchPage({ searchParams: Promise.resolve({}) });

    expect(prisma.toyAd.findMany).toHaveBeenCalledTimes(1);
    const callArgs = vi.mocked(prisma.toyAd.findMany).mock.calls[0][0];
    expect(callArgs?.where).toMatchObject({ status: "PUBLISHED" });
  });

  it("filtra per ageRange quando il parametro è valido", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([] as never);

    await SearchPage({ searchParams: Promise.resolve({ ageRange: "AGE_3_5" }) });

    const callArgs = vi.mocked(prisma.toyAd.findMany).mock.calls[0][0];
    expect(callArgs?.where).toMatchObject({ status: "PUBLISHED", ageRange: "AGE_3_5" });
  });

  it("ignora ageRange non valido", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([] as never);

    await SearchPage({ searchParams: Promise.resolve({ ageRange: "INVALID" }) });

    const callArgs = vi.mocked(prisma.toyAd.findMany).mock.calls[0][0];
    expect(callArgs?.where).not.toHaveProperty("ageRange");
    expect(callArgs?.where).toMatchObject({ status: "PUBLISHED" });
  });

  it("include filtro testo quando query è presente", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([] as never);

    await SearchPage({ searchParams: Promise.resolve({ q: "triciclo" }) });

    const callArgs = vi.mocked(prisma.toyAd.findMany).mock.calls[0][0];
    expect(callArgs?.where).toMatchObject({
      status: "PUBLISHED",
      OR: [
        { title: { contains: "triciclo", mode: "insensitive" } },
        { description: { contains: "triciclo", mode: "insensitive" } },
      ],
    });
  });

  it("non richiede autenticazione", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([] as never);

    // Should not throw even without any user/auth mock
    await expect(
      SearchPage({ searchParams: Promise.resolve({}) })
    ).resolves.not.toThrow();
  });

  it("ritorna array vuoto quando findMany ritorna vuoto", async () => {
    const { prisma } = await import("@/lib/prisma");
    const SearchPage = (await import("./page")).default;

    vi.mocked(prisma.toyAd.findMany).mockResolvedValueOnce([] as never);

    // Must not throw — page handles empty results gracefully
    await expect(
      SearchPage({ searchParams: Promise.resolve({}) })
    ).resolves.toBeDefined();
  });
});
