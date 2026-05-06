"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { sendMessage } from "@/lib/chat/service";

export type SendMessageActionState = {
  error?: string;
};

export async function sendMessageAction(
  _prevState: SendMessageActionState,
  formData: FormData
): Promise<SendMessageActionState> {
  const conversationId = formData.get("conversationId") as string;
  const content = formData.get("content") as string;

  const result = await sendMessage(conversationId, content, {
    getCurrentUserId: async () => {
      const user = await getCurrentUser();
      return user?.id ?? null;
    },
    findConversation: async (convId) => {
      return prisma.conversation.findUnique({
        where: { id: convId },
        select: { buyerId: true, ownerId: true },
      });
    },
    saveMessage: async ({ id, conversationId: convId, senderId, content: msg }) => {
      await prisma.message.create({
        data: { id, conversationId: convId, senderId, content: msg },
      });
    },
  });

  if (!result.success) {
    return { error: result.error };
  }

  redirect(`/dashboard/chats/${conversationId}`);
}
