import { describe, expect, it, vi } from "vitest";
import { getOrCreateConversation, sendMessage, listMessages } from "./service";

// ─── getOrCreateConversation ──────────────────────────────────────────────────

const baseGetOrCreateDeps = {
  getCurrentUserId: async () => "buyer-1",
  findAd: async (_adId: string) => ({ ownerId: "owner-1" }),
  findExistingConversation: async (_toyAdId: string, _buyerId: string) => null as { id: string } | null,
  createConversation: vi.fn(async () => undefined),
};

describe("getOrCreateConversation", () => {
  it("crea una nuova conversazione quando non esiste", async () => {
    const createConversation = vi.fn(async () => undefined);
    const result = await getOrCreateConversation("ad-1", {
      ...baseGetOrCreateDeps,
      createConversation,
    });
    expect(result.success).toBe(true);
    expect(createConversation).toHaveBeenCalledTimes(1);
  });

  it("restituisce la conversazione esistente senza crearne una nuova (idempotenza)", async () => {
    const createConversation = vi.fn(async () => undefined);
    const result = await getOrCreateConversation("ad-1", {
      ...baseGetOrCreateDeps,
      findExistingConversation: async () => ({ id: "conv-existing" }),
      createConversation,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.conversationId).toBe("conv-existing");
    expect(createConversation).not.toHaveBeenCalled();
  });

  it("blocca se il buyer e il proprietario dell'annuncio", async () => {
    const result = await getOrCreateConversation("ad-1", {
      ...baseGetOrCreateDeps,
      getCurrentUserId: async () => "owner-1",
      findAd: async () => ({ ownerId: "owner-1" }),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("te stesso");
  });

  it("blocca se la sessione e scaduta", async () => {
    const result = await getOrCreateConversation("ad-1", {
      ...baseGetOrCreateDeps,
      getCurrentUserId: async () => null,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Sessione scaduta");
  });

  it("blocca se l'annuncio non esiste", async () => {
    const result = await getOrCreateConversation("ad-1", {
      ...baseGetOrCreateDeps,
      findAd: async () => null,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("non trovato");
  });
});

// ─── sendMessage ─────────────────────────────────────────────────────────────

const baseConv = { buyerId: "buyer-1", ownerId: "owner-1" };

describe("sendMessage", () => {
  it("salva il messaggio se il mittente e il buyer", async () => {
    const saveMessage = vi.fn(async () => undefined);
    const result = await sendMessage("conv-1", "Ciao!", {
      getCurrentUserId: async () => "buyer-1",
      findConversation: async () => baseConv,
      saveMessage,
    });
    expect(result.success).toBe(true);
    expect(saveMessage).toHaveBeenCalledTimes(1);
  });

  it("salva il messaggio se il mittente e il proprietario", async () => {
    const saveMessage = vi.fn(async () => undefined);
    const result = await sendMessage("conv-1", "Certo!", {
      getCurrentUserId: async () => "owner-1",
      findConversation: async () => baseConv,
      saveMessage,
    });
    expect(result.success).toBe(true);
    expect(saveMessage).toHaveBeenCalledTimes(1);
  });

  it("blocca se il mittente non e un partecipante", async () => {
    const result = await sendMessage("conv-1", "Messaggio intruso", {
      getCurrentUserId: async () => "stranger-99",
      findConversation: async () => baseConv,
      saveMessage: vi.fn(),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("autorizzato");
  });

  it("blocca se il messaggio e vuoto", async () => {
    const result = await sendMessage("conv-1", "   ", {
      getCurrentUserId: async () => "buyer-1",
      findConversation: async () => baseConv,
      saveMessage: vi.fn(),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("vuoto");
  });

  it("blocca se la conversazione non esiste", async () => {
    const result = await sendMessage("conv-1", "Ciao", {
      getCurrentUserId: async () => "buyer-1",
      findConversation: async () => null,
      saveMessage: vi.fn(),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("non trovata");
  });

  it("blocca se la sessione e scaduta", async () => {
    const result = await sendMessage("conv-1", "Ciao", {
      getCurrentUserId: async () => null,
      findConversation: async () => baseConv,
      saveMessage: vi.fn(),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Sessione scaduta");
  });
});

// ─── listMessages ─────────────────────────────────────────────────────────────

describe("listMessages", () => {
  it("restituisce i messaggi se l'utente e un partecipante", async () => {
    const msgs = [
      { id: "m-1", senderId: "buyer-1", content: "Ciao", createdAt: new Date() },
    ];
    const result = await listMessages("conv-1", {
      getCurrentUserId: async () => "buyer-1",
      findConversation: async () => baseConv,
      getMessages: async () => msgs,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.messages).toHaveLength(1);
  });

  it("blocca se l'utente non e un partecipante", async () => {
    const result = await listMessages("conv-1", {
      getCurrentUserId: async () => "stranger-99",
      findConversation: async () => baseConv,
      getMessages: async () => [],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("autorizzato");
  });
});
