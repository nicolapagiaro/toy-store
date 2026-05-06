"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { getOrCreateConversation } from "@/lib/chat/service";

export type StartChatActionState = {
  error?: string;
};

export async function startChatAction(
  _prevState: StartChatActionState,
  formData: FormData
): Promise<StartChatActionState> {
  const toyAdId = formData.get("toyAdId") as string;

  const result = await getOrCreateConversation(toyAdId, {
    getCurrentUserId: async () => {
      const user = await getCurrentUser();
      return user?.id ?? null;
    },
    findAd: async (adId) => {
      return prisma.toyAd.findUnique({ where: { id: adId }, select: { ownerId: true } });
    },
    findExistingConversation: async (adId, buyerId) => {
      return prisma.conversation.findUnique({
        where: { toyAdId_buyerId: { toyAdId: adId, buyerId } },
        select: { id: true },
      });
    },
    createConversation: async ({ id, toyAdId: adId, buyerId, ownerId }) => {
      await prisma.conversation.create({
        data: { id, toyAdId: adId, buyerId, ownerId },
      });
    },
  });

  if (!result.success) {
    return { error: result.error };
  }

  redirect(`/dashboard/chats/${result.conversationId}`);
}
