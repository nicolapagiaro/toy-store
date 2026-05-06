import { randomUUID } from "node:crypto";
import type { ToyAd } from "@prisma/client";
import { normalizeToyAdFormInput, validateToyAdInput, type ToyAdValidationErrors } from "@/lib/toy-ads/validation";

export type CreateToyAdResult =
  | { success: true; toyAdId: string }
  | { success: false; errors: ToyAdValidationErrors };

type CreateToyAdDependencies = {
  getCurrentUserId: () => Promise<string | null>;
  uploadPhoto: (args: { userId: string; adId: string; file: File; index: number }) => Promise<string>;
  saveAd: (args: {
    adId: string;
    ownerId: string;
    title: string;
    description: string;
    ageRange: ToyAd["ageRange"];
    condition: ToyAd["condition"];
    city: string;
    district: string | null;
    imagePaths: string[];
  }) => Promise<void>;
};

export async function createToyAdFromFormData(
  formData: FormData,
  dependencies: CreateToyAdDependencies
): Promise<CreateToyAdResult> {
  const ownerId = await dependencies.getCurrentUserId();
  if (!ownerId) {
    return {
      success: false,
      errors: { form: "Sessione scaduta. Effettua di nuovo l'accesso per pubblicare l'annuncio." },
    };
  }

  const normalized = normalizeToyAdFormInput(formData);
  const validation = validateToyAdInput(normalized);

  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  const adId = randomUUID();

  try {
    const imagePaths = await Promise.all(
      validation.data.photos.map((file, index) =>
        dependencies.uploadPhoto({
          userId: ownerId,
          adId,
          file,
          index,
        })
      )
    );

    await dependencies.saveAd({
      adId,
      ownerId,
      title: validation.data.title,
      description: validation.data.description,
      ageRange: validation.data.ageRange,
      condition: validation.data.condition,
      city: validation.data.city,
      district: validation.data.district,
      imagePaths,
    });
  } catch {
    return {
      success: false,
      errors: { photos: "Errore durante il caricamento foto. Riprova tra qualche istante." },
    };
  }

  return { success: true, toyAdId: adId };
}
