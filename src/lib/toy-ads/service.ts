import { randomUUID } from "node:crypto";
import type { ToyAd } from "@prisma/client";
import {
  normalizeToyAdFormInput,
  validateToyAdInput,
  type ToyAdValidationErrors,
  normalizeToyAdEditFormInput,
  validateToyAdEditInput,
  type ToyAdEditValidationErrors,
} from "@/lib/toy-ads/validation";

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

export type UpdateToyAdResult =
  | { success: true }
  | { success: false; errors: ToyAdEditValidationErrors };

type UpdateToyAdDependencies = {
  getCurrentUserId: () => Promise<string | null>;
  loadAd: (adId: string) => Promise<{ ownerId: string; imagePaths: string[] } | null>;
  uploadPhoto: (args: { userId: string; adId: string; file: File; index: number }) => Promise<string>;
  deletePhoto: (path: string) => Promise<void>;
  updateAd: (args: {
    adId: string;
    title: string;
    description: string;
    ageRange: ToyAd["ageRange"];
    condition: ToyAd["condition"];
    city: string;
    district: string | null;
    imagePaths: string[];
    snapshotUpdatedAt: string;
  }) => Promise<void>;
};

export async function updateToyAdFromFormData(
  formData: FormData,
  adId: string,
  dependencies: UpdateToyAdDependencies
): Promise<UpdateToyAdResult> {
  const currentUserId = await dependencies.getCurrentUserId();
  if (!currentUserId) {
    return {
      success: false,
      errors: { form: "Sessione scaduta. Effettua di nuovo l'accesso per modificare l'annuncio." },
    };
  }

  const ad = await dependencies.loadAd(adId);
  if (!ad) {
    return {
      success: false,
      errors: { form: "Annuncio non trovato." },
    };
  }

  if (ad.ownerId !== currentUserId) {
    return {
      success: false,
      errors: { form: "Non sei autorizzato a modificare questo annuncio." },
    };
  }

  const normalized = normalizeToyAdEditFormInput(formData);
  const validation = validateToyAdEditInput(normalized);

  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  const { pathsToKeep, newPhotos } = validation.data;
  const photosToRemove = ad.imagePaths.filter((p) => !pathsToKeep.includes(p));

  try {
    const newUploadedPaths = await Promise.all(
      newPhotos.map((file, index) =>
        dependencies.uploadPhoto({
          userId: currentUserId,
          adId,
          file,
          index: pathsToKeep.length + index,
        })
      )
    );

    await Promise.all(photosToRemove.map((path) => dependencies.deletePhoto(path)));

    await dependencies.updateAd({
      adId,
      title: validation.data.title,
      description: validation.data.description,
      ageRange: validation.data.ageRange,
      condition: validation.data.condition,
      city: validation.data.city,
      district: validation.data.district,
      imagePaths: [...pathsToKeep, ...newUploadedPaths],
      snapshotUpdatedAt: validation.data.snapshotUpdatedAt,
    });
  } catch {
    return {
      success: false,
      errors: { photos: "Errore durante l'aggiornamento. Riprova tra qualche istante." },
    };
  }

  return { success: true };
}
