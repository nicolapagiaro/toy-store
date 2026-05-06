"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/server";
import { createToyAdFromFormData } from "@/lib/toy-ads/service";

export type CreateToyAdActionState = {
  errors?: Record<string, string>;
};

export async function createToyAdAction(
  _prevState: CreateToyAdActionState,
  formData: FormData
): Promise<CreateToyAdActionState> {
  const result = await createToyAdFromFormData(formData, {
    getCurrentUserId: async () => {
      const user = await getCurrentUser();
      return user?.id ?? null;
    },
    uploadPhoto: async ({ userId, adId, file, index }) => {
      const supabase = await createClient();
      const extension = file.name.split(".").pop() ?? "jpg";
      const filePath = `${userId}/${adId}/${index + 1}-${Date.now()}.${extension}`;
      const bytes = await file.arrayBuffer();

      const { error } = await supabase.storage.from("toy-ads").upload(filePath, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      return filePath;
    },
    saveAd: async (ad) => {
      await prisma.toyAd.create({
        data: {
          id: ad.adId,
          ownerId: ad.ownerId,
          title: ad.title,
          description: ad.description,
          ageRange: ad.ageRange,
          condition: ad.condition,
          city: ad.city,
          district: ad.district,
          imagePaths: ad.imagePaths,
        },
      });
    },
  });

  if (!result.success) {
    return { errors: result.errors as Record<string, string> };
  }

  redirect(`/dashboard/ads/${result.toyAdId}`);
}
