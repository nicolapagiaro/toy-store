import { describe, expect, it, vi, beforeEach } from "vitest";
import { sendMessageAction } from "./actions";

vi.mock("@/lib/user", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "buyer-1", email: "buyer@example.com" })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    conversation: {
      findUnique: vi.fn(async () => ({ buyerId: "buyer-1", ownerId: "owner-1" })),
    },
    message: {
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

function buildFormData(content = "Ciao!", conversationId = "conv-1") {
  const fd = new FormData();
  fd.set("conversationId", conversationId);
  fd.set("content", content);
  return fd;
}

describe("sendMessageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("salva il messaggio e redirige alla chat se mittente e partecipante", async () => {
    const { prisma } = await import("@/lib/prisma");
    const { redirect } = await import("next/navigation");

    try {
      await sendMessageAction({}, buildFormData());
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.message !== "NEXT_REDIRECT") throw err;
    }

    expect(prisma.message.create).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/dashboard/chats/conv-1");
  });

  it("restituisce errore se il mittente non e un partecipante", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "stranger-99", email: "x@x.com" });

    const result = await sendMessageAction({}, buildFormData());

    expect(result.error).toContain("autorizzato");
  });

  it("restituisce errore se il messaggio e vuoto", async () => {
    const result = await sendMessageAction({}, buildFormData("   "));

    expect(result.error).toContain("vuoto");
  });

  it("restituisce errore se la sessione e scaduta", async () => {
    const { getCurrentUser } = await import("@/lib/user");
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    const result = await sendMessageAction({}, buildFormData());

    expect(result.error).toContain("Sessione scaduta");
  });

  it("restituisce errore se la conversazione non esiste", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.conversation.findUnique).mockResolvedValueOnce(null);

    const result = await sendMessageAction({}, buildFormData());

    expect(result.error).toContain("non trovata");
  });
});
