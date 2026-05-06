import { randomUUID } from "node:crypto";

// ─── getOrCreateConversation ──────────────────────────────────────────────────

export type GetOrCreateConversationResult =
  | { success: true; conversationId: string }
  | { success: false; error: string };

type GetOrCreateConversationDeps = {
  getCurrentUserId: () => Promise<string | null>;
  findAd: (adId: string) => Promise<{ ownerId: string } | null>;
  findExistingConversation: (toyAdId: string, buyerId: string) => Promise<{ id: string } | null>;
  createConversation: (args: {
    id: string;
    toyAdId: string;
    buyerId: string;
    ownerId: string;
  }) => Promise<void>;
};

export async function getOrCreateConversation(
  toyAdId: string,
  deps: GetOrCreateConversationDeps
): Promise<GetOrCreateConversationResult> {
  const buyerId = await deps.getCurrentUserId();
  if (!buyerId) {
    return { success: false, error: "Sessione scaduta. Effettua di nuovo l'accesso." };
  }

  const ad = await deps.findAd(toyAdId);
  if (!ad) {
    return { success: false, error: "Annuncio non trovato." };
  }

  if (ad.ownerId === buyerId) {
    return { success: false, error: "Non puoi avviare una chat con te stesso." };
  }

  const existing = await deps.findExistingConversation(toyAdId, buyerId);
  if (existing) {
    return { success: true, conversationId: existing.id };
  }

  const conversationId = randomUUID();
  await deps.createConversation({ id: conversationId, toyAdId, buyerId, ownerId: ad.ownerId });

  return { success: true, conversationId };
}

// ─── sendMessage ──────────────────────────────────────────────────────────────

export type SendMessageResult =
  | { success: true }
  | { success: false; error: string };

type SendMessageDeps = {
  getCurrentUserId: () => Promise<string | null>;
  findConversation: (conversationId: string) => Promise<{ buyerId: string; ownerId: string } | null>;
  saveMessage: (args: {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
  }) => Promise<void>;
};

export async function sendMessage(
  conversationId: string,
  content: string,
  deps: SendMessageDeps
): Promise<SendMessageResult> {
  const senderId = await deps.getCurrentUserId();
  if (!senderId) {
    return { success: false, error: "Sessione scaduta. Effettua di nuovo l'accesso." };
  }

  const conversation = await deps.findConversation(conversationId);
  if (!conversation) {
    return { success: false, error: "Conversazione non trovata." };
  }

  if (conversation.buyerId !== senderId && conversation.ownerId !== senderId) {
    return { success: false, error: "Non sei autorizzato a inviare messaggi in questa chat." };
  }

  if (!content.trim()) {
    return { success: false, error: "Il messaggio non puo essere vuoto." };
  }

  await deps.saveMessage({
    id: randomUUID(),
    conversationId,
    senderId,
    content: content.trim(),
  });

  return { success: true };
}

// ─── listMessages ─────────────────────────────────────────────────────────────

export type MessageItem = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

export type ListMessagesResult =
  | { success: true; messages: MessageItem[] }
  | { success: false; error: string };

type ListMessagesDeps = {
  getCurrentUserId: () => Promise<string | null>;
  findConversation: (conversationId: string) => Promise<{ buyerId: string; ownerId: string } | null>;
  getMessages: (conversationId: string) => Promise<MessageItem[]>;
};

export async function listMessages(
  conversationId: string,
  deps: ListMessagesDeps
): Promise<ListMessagesResult> {
  const userId = await deps.getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Sessione scaduta. Effettua di nuovo l'accesso." };
  }

  const conversation = await deps.findConversation(conversationId);
  if (!conversation) {
    return { success: false, error: "Conversazione non trovata." };
  }

  if (conversation.buyerId !== userId && conversation.ownerId !== userId) {
    return { success: false, error: "Non sei autorizzato a vedere questa chat." };
  }

  const messages = await deps.getMessages(conversationId);
  return { success: true, messages };
}
