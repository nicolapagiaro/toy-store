import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateToyAdAction } from "./actions";

// --- Module mocks ---

vi.mock("@/lib/user", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1", email: "test@example.com" })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    toyAd: {
      findUnique: vi.fn(async () => ({
        id: "ad-123",
        ownerId: "owner-id",
        imagePaths: ["toy-ad/ad-123/photos/1.jpg"],
      })),
      update: vi.fn(async () => undefined),
    },
  },
}));

const mockUpload = vi.fn(async () => ({ data: { path: "toy-ad/ad-123/photos/2.jpg" }, error: null }));
const mockRemove = vi.fn(async () => ({ data: null, error: null }));
const mockStorageFrom = vi.fn(() => ({ upload: mockUpload, remove: mockRemove }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    storage: {
      from: mockStorageFrom,
    },
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    // Simulate Next.js redirect throwing a special error, as it does at runtime
    const err = new Error("NEXT_REDIRECT");
    (err as NodeJS.ErrnoException).code = "NEXT_REDIRECT";
    throw err;
  }),
}));

// --- Helpers ---

function buildValidEditFormData(overrides?: { adId?: string; userId?: string }) {
  const formData = new FormData();
  formData.set("adId", overrides?.adId ?? "ad-123");
  formData.set("title", "Triciclo evolutivo");
  formData.set("description", "Usato poco, ottimo stato");
  formData.set("ageRange", "AGE_3_5");
  formData.set("condition", "EXCELLENT");
  formData.set("city", "Milano");
  formData.set("district", "Niguarda");
  // Keep one existing image — no new uploads needed
  formData.append("existingImagePaths", "toy-ad/ad-123/photos/1.jpg");
  return formData;
}

// --- Tests ---

describe("updateToyAdAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns authorization error and does not update when caller is not the owner", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    const { prisma } = await import("@/lib/prisma");

    // Non-owner user
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "other-user", email: "other@example.com" });
    // Ad belongs to a different owner
    vi.mocked(prisma.toyAd.findUnique).mockResolvedValueOnce({
      id: "ad-123",
      ownerId: "owner-id",
      imagePaths: ["toy-ad/ad-123/photos/1.jpg"],
    } as never);

    const result = await updateToyAdAction({}, buildValidEditFormData());

    expect(result.errors?.form).toContain("Non sei autorizzato");
    expect(prisma.toyAd.update).not.toHaveBeenCalled();
  });

  it("calls prisma.toyAd.update and redirect when caller is the owner and payload is valid", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    const { prisma } = await import("@/lib/prisma");
    const { redirect } = await import("next/navigation");

    // Owner matches ad.ownerId
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "owner-id", email: "owner@example.com" });
    vi.mocked(prisma.toyAd.findUnique).mockResolvedValueOnce({
      id: "ad-123",
      ownerId: "owner-id",
      imagePaths: ["toy-ad/ad-123/photos/1.jpg"],
    } as never);

    try {
      await updateToyAdAction({}, buildValidEditFormData());
    } catch (err) {
      // Next.js redirect() throws — this is expected in the success path
      const error = err as NodeJS.ErrnoException;
      if (error.message !== "NEXT_REDIRECT") throw err;
    }

    expect(prisma.toyAd.update).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/dashboard/ads/ad-123");
  });
});