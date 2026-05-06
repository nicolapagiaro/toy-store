import { ToyAdAgeRange, ToyAdCondition } from "@prisma/client";

export type ToyAdFormInput = {
  title: string;
  description: string;
  ageRange: string;
  condition: string;
  city: string;
  district: string;
  photos: File[];
};

export type ToyAdValidationErrors = Partial<Record<keyof ToyAdFormInput | "form", string>>;

export type ToyAdEditFormInput = {
  title: string;
  description: string;
  ageRange: string;
  condition: string;
  city: string;
  district: string;
  existingImagePaths: string[];
  photosToRemove: string[];
  newPhotos: File[];
  snapshotUpdatedAt: string;
};

export type ToyAdEditValidationErrors = Partial<
  Record<"title" | "description" | "ageRange" | "condition" | "city" | "photos" | "form", string>
>;

export type ValidToyAdEditInput = {
  title: string;
  description: string;
  ageRange: ToyAdAgeRange;
  condition: ToyAdCondition;
  city: string;
  district: string | null;
  pathsToKeep: string[];
  newPhotos: File[];
  snapshotUpdatedAt: string;
};

export type ValidToyAdInput = {
  title: string;
  description: string;
  ageRange: ToyAdAgeRange;
  condition: ToyAdCondition;
  city: string;
  district: string | null;
  photos: File[];
};

const AGE_RANGE_MAP: Record<string, ToyAdAgeRange> = {
  AGE_0_2: ToyAdAgeRange.AGE_0_2,
  AGE_3_5: ToyAdAgeRange.AGE_3_5,
  AGE_6_8: ToyAdAgeRange.AGE_6_8,
  AGE_9_12: ToyAdAgeRange.AGE_9_12,
};

const CONDITION_MAP: Record<string, ToyAdCondition> = {
  LIKE_NEW: ToyAdCondition.LIKE_NEW,
  EXCELLENT: ToyAdCondition.EXCELLENT,
  GOOD: ToyAdCondition.GOOD,
};

export function normalizeToyAdEditFormInput(formData: FormData): ToyAdEditFormInput {
  const newPhotoEntries = formData.getAll("newPhotos");
  const newPhotos = newPhotoEntries.filter((e): e is File => e instanceof File && e.size > 0);

  const existingImagePaths = formData.getAll("existingImagePaths").map(String);
  const photosToRemove = formData.getAll("photosToRemove").map(String);

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    ageRange: String(formData.get("ageRange") ?? ""),
    condition: String(formData.get("condition") ?? ""),
    city: String(formData.get("city") ?? ""),
    district: String(formData.get("district") ?? ""),
    existingImagePaths,
    photosToRemove,
    newPhotos,
    snapshotUpdatedAt: String(formData.get("snapshotUpdatedAt") ?? ""),
  };
}

export function validateToyAdEditInput(input: ToyAdEditFormInput):
  | { success: true; data: ValidToyAdEditInput }
  | { success: false; errors: ToyAdEditValidationErrors } {
  const errors: ToyAdEditValidationErrors = {};

  const title = input.title.trim();
  const description = input.description.trim();
  const city = input.city.trim();
  const district = input.district.trim();

  if (!title) errors.title = "Inserisci un titolo per l'annuncio.";
  if (!description) errors.description = "Inserisci una descrizione del giocattolo.";
  if (!city) errors.city = "Inserisci la citta del ritiro.";

  const ageRange = AGE_RANGE_MAP[input.ageRange];
  if (!ageRange) errors.ageRange = "Seleziona una fascia d'eta.";

  const condition = CONDITION_MAP[input.condition];
  if (!condition) errors.condition = "Indica la condizione del giocattolo.";

  const pathsToKeep = input.existingImagePaths.filter((p) => !input.photosToRemove.includes(p));
  const totalPhotos = pathsToKeep.length + input.newPhotos.length;
  if (totalPhotos < 1) errors.photos = "Mantieni o aggiungi almeno una foto del giocattolo.";

  if (Object.keys(errors).length > 0) {
    errors.form =
      "Non e stato possibile salvare: inserisci titolo, fascia d'eta, condizione, localita e almeno una foto.";
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      description,
      ageRange: ageRange!,
      condition: condition!,
      city,
      district: district || null,
      pathsToKeep,
      newPhotos: input.newPhotos,
      snapshotUpdatedAt: input.snapshotUpdatedAt,
    },
  };
}

export function normalizeToyAdFormInput(formData: FormData): ToyAdFormInput {
  const photoEntries = formData.getAll("photos");
  const photos = photoEntries.filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    ageRange: String(formData.get("ageRange") ?? ""),
    condition: String(formData.get("condition") ?? ""),
    city: String(formData.get("city") ?? ""),
    district: String(formData.get("district") ?? ""),
    photos,
  };
}

export function validateToyAdInput(input: ToyAdFormInput):
  | { success: true; data: ValidToyAdInput }
  | { success: false; errors: ToyAdValidationErrors } {
  const errors: ToyAdValidationErrors = {};

  const title = input.title.trim();
  const description = input.description.trim();
  const city = input.city.trim();
  const district = input.district.trim();

  if (!title) errors.title = "Inserisci un titolo per l'annuncio.";
  if (!description) errors.description = "Inserisci una descrizione del giocattolo.";
  if (!city) errors.city = "Inserisci la citta del ritiro.";

  const ageRange = AGE_RANGE_MAP[input.ageRange];
  if (!ageRange) errors.ageRange = "Seleziona una fascia d'eta.";

  const condition = CONDITION_MAP[input.condition];
  if (!condition) errors.condition = "Indica la condizione del giocattolo.";

  if (input.photos.length < 1) errors.photos = "Aggiungi almeno una foto reale del giocattolo prima di pubblicare.";

  if (Object.keys(errors).length > 0) {
    errors.form =
      "Non e stato possibile pubblicare: inserisci titolo, fascia d'eta, condizione, localita e almeno una foto.";
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      description,
      ageRange,
      condition: condition!,
      city,
      district: district || null,
      photos: input.photos,
    },
  };
}
