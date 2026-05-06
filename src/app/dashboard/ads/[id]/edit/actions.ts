"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/server";
import { buildMediaObjectPath, MEDIA_BUCKET, MEDIA_OBJECT_PREFIX } from "@/lib/media/storage";
import { updateToyAdFromFormData } from "@/lib/toy-ads/service";

export type UpdateToyAdActionState = {
  errors?: Record<string, string>;
};

export async function updateToyAdAction(
  _prevState: UpdateToyAdActionState,
  formData: FormData
): Promise<UpdateToyAdActionState> {
  const adId = formData.get("adId");
  if (!adId || typeof adId !== "string") {
    return { errors: { form: "ID annuncio mancante. Ricarica la pagina e riprova." } };
  }

  const result = await updateToyAdFromFormData(formData, adId, {
    getCurrentUserId: async () => {
      const user = await getCurrentUser();
      return user?.id ?? null;
    },
    loadAd: async (id) => {
      const ad = await prisma.toyAd.findUnique({ where: { id } });
      if (!ad) return null;
      return { ownerId: ad.ownerId, imagePaths: ad.imagePaths };
    },
    uploadPhoto: async ({ userId, adId: id, file, index }) => {
      const supabase = await createClient();
      const extension = file.name.split(".").pop() ?? "jpg";
      const filePath = buildMediaObjectPath({
        modelPrefix: MEDIA_OBJECT_PREFIX.TOY_AD,
        modelId: id,
        attachmentName: "photos",
        fileName: `${index + 1}-${Date.now()}-${userId}.${extension}`,
      });
      const bytes = await file.arrayBuffer();

      const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(filePath, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

      return filePath;
    },
    deletePhoto: async (path) => {
      const supabase = await createClient();
      const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
    },
    updateAd: async (ad) => {
      const snapshotDate = ad.snapshotUpdatedAt ? new Date(ad.snapshotUpdatedAt) : undefined;
      await prisma.toyAd.update({
        where: snapshotDate ? { id: ad.adId, updatedAt: snapshotDate } : { id: ad.adId },
        data: {
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

  redirect(`/dashboard/ads/${adId}`);
}