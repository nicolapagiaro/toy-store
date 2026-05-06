import { describe, expect, it, vi, beforeEach } from "vitest";
import { startChatAction } from "./actions";

vi.mock("@/lib/user", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "buyer-1", email: "buyer@example.com" })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    toyAd: {
      findUnique: vi.fn(async () => ({ ownerId: "owner-1" })),
    },
    conversation: {
      findUnique: vi.fn(async () => null),
      create: vi.fn(async () => undefined),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    const err = new Error("NEXT_REDIRECT");
    (err as NodeJS.ErrnoException).code = "NEXT_REDIRECT";
    throw err;
  }),
}));

function buildFormData(toyAdId = "ad-1") {
  const fd = new FormData();
  fd.set("toyAdId", toyAdId);
  return fd;
}

describe("startChatAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirige alla pagina chat quando la conversazione viene creata", async () => {
    const { redirect } = await import("next/navigation");
    try {
      await startChatAction({}, buildFormData());
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.message !== "NEXT_REDIRECT") throw err;
    }
    expect(redirect).toHaveBeenCalledWith(expect.stringContaining("/dashboard/chats/"));
  });

  it("redirige alla chat esistente senza crearne una nuova (idempotenza)", async () => {
    const { prisma } = await import("@/lib/prisma");
    const { redirect } = await import("next/navigation");

    vi.mocked(prisma.conversation.findUnique).mockResolvedValueOnce({ id: "conv-existing" } as never);

    try {
      await startChatAction({}, buildFormData());
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.message !== "NEXT_REDIRECT") throw err;
    }

    expect(prisma.conversation.create).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/dashboard/chats/conv-existing");
  });

  it("restituisce errore se l'utente non e autenticato", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    const result = await startChatAction({}, buildFormData());

    expect(result.error).toContain("Sessione scaduta");
  });

  it("restituisce errore se il buyer tenta di chattare con se stesso", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "owner-1", email: "owner@example.com" });
    vi.mocked(prisma.toyAd.findUnique).mockResolvedValueOnce({ ownerId: "owner-1" } as never);

    const result = await startChatAction({}, buildFormData());

    expect(result.error).toContain("te stesso");
  });
});
