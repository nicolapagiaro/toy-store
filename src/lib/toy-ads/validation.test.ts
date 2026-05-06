import { describe, expect, it } from "vitest";
import { normalizeToyAdEditFormInput, validateToyAdEditInput, validateToyAdInput } from "./validation";

function fakePhoto(name = "toy.jpg") {
  return new File(["content"], name, { type: "image/jpeg" });
}

describe("validateToyAdInput", () => {
  it("returns contextual errors for missing required fields", () => {
    const result = validateToyAdInput({
      title: "",
      description: "",
      ageRange: "",
      condition: "",
      city: "",
      district: "",
      photos: [],
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors.title).toBe("Inserisci un titolo per l'annuncio.");
    expect(result.errors.description).toBe("Inserisci una descrizione del giocattolo.");
    expect(result.errors.ageRange).toBe("Seleziona una fascia d'eta.");
    expect(result.errors.condition).toBe("Indica la condizione del giocattolo.");
    expect(result.errors.city).toBe("Inserisci la citta del ritiro.");
    expect(result.errors.photos).toContain("Aggiungi almeno una foto");
    expect(result.errors.form).toContain("Non e stato possibile pubblicare");
  });

  it("accepts valid input and normalizes optional district", () => {
    const result = validateToyAdInput({
      title: "  Triciclo  ",
      description: "  Ottimo stato  ",
      ageRange: "AGE_3_5",
      condition: "EXCELLENT",
      city: "  Milano ",
      district: "  ",
      photos: [fakePhoto()],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.title).toBe("Triciclo");
    expect(result.data.description).toBe("Ottimo stato");
    expect(result.data.city).toBe("Milano");
    expect(result.data.district).toBeNull();
  });
});

describe("validateToyAdEditInput", () => {
  const validBase = {
    title: "Triciclo",
    description: "Ottimo stato",
    ageRange: "AGE_3_5",
    condition: "EXCELLENT",
    city: "Milano",
    district: "",
    existingImagePaths: [],
    photosToRemove: [],
    newPhotos: [],
  };

  it("returns errors for all missing required fields", () => {
    const result = validateToyAdEditInput({
      title: "",
      description: "",
      ageRange: "",
      condition: "",
      city: "",
      district: "",
      existingImagePaths: [],
      photosToRemove: [],
      newPhotos: [],
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors.title).toBe("Inserisci un titolo per l'annuncio.");
    expect(result.errors.description).toBe("Inserisci una descrizione del giocattolo.");
    expect(result.errors.ageRange).toBe("Seleziona una fascia d'eta.");
    expect(result.errors.condition).toBe("Indica la condizione del giocattolo.");
    expect(result.errors.city).toBe("Inserisci la citta del ritiro.");
    expect(result.errors.photos).toContain("almeno una foto");
    expect(result.errors.form).toContain("Non e stato possibile salvare");
  });

  it("returns error for invalid ageRange", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      ageRange: "INVALID",
      newPhotos: [fakePhoto()],
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors.ageRange).toBe("Seleziona una fascia d'eta.");
    expect(result.errors.condition).toBeUndefined();
  });

  it("returns error for invalid condition", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      condition: "BROKEN",
      newPhotos: [fakePhoto()],
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors.condition).toBe("Indica la condizione del giocattolo.");
    expect(result.errors.ageRange).toBeUndefined();
  });

  it("succeeds when existing photos are present and nothing is removed", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      existingImagePaths: ["img/photo1.jpg"],
      photosToRemove: [],
      newPhotos: [],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.pathsToKeep).toEqual(["img/photo1.jpg"]);
    expect(result.data.newPhotos).toHaveLength(0);
  });

  it("returns photos error when all existing photos are removed and no new ones added", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      existingImagePaths: ["img/photo1.jpg", "img/photo2.jpg"],
      photosToRemove: ["img/photo1.jpg", "img/photo2.jpg"],
      newPhotos: [],
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors.photos).toContain("almeno una foto");
  });

  it("succeeds when no existing photos but new photos are provided", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      existingImagePaths: [],
      photosToRemove: [],
      newPhotos: [fakePhoto()],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.pathsToKeep).toHaveLength(0);
    expect(result.data.newPhotos).toHaveLength(1);
  });

  it("succeeds with mix of kept existing photos and new photos", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      existingImagePaths: ["img/a.jpg", "img/b.jpg"],
      photosToRemove: ["img/a.jpg"],
      newPhotos: [fakePhoto("extra.jpg")],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.pathsToKeep).toEqual(["img/b.jpg"]);
    expect(result.data.newPhotos).toHaveLength(1);
  });

  it("returns correct normalized data for valid complete input", () => {
    const photo = fakePhoto("nuovo.jpg");
    const result = validateToyAdEditInput({
      title: "  Lego  ",
      description: "  Completo  ",
      ageRange: "AGE_6_8",
      condition: "GOOD",
      city: "  Roma  ",
      district: "  Prati  ",
      existingImagePaths: ["img/old1.jpg", "img/old2.jpg"],
      photosToRemove: ["img/old1.jpg"],
      newPhotos: [photo],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.title).toBe("Lego");
    expect(result.data.description).toBe("Completo");
    expect(result.data.ageRange).toBe("AGE_6_8");
    expect(result.data.condition).toBe("GOOD");
    expect(result.data.city).toBe("Roma");
    expect(result.data.district).toBe("Prati");
    expect(result.data.pathsToKeep).toEqual(["img/old2.jpg"]);
    expect(result.data.newPhotos).toEqual([photo]);
  });

  it("sets district to null when district is blank", () => {
    const result = validateToyAdEditInput({
      ...validBase,
      district: "   ",
      newPhotos: [fakePhoto()],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.district).toBeNull();
  });
});

describe("normalizeToyAdEditFormInput", () => {
  it("extracts scalar fields and parses array fields from FormData", () => {
    const fd = new FormData();
    fd.append("title", "Palla");
    fd.append("description", "Come nuova");
    fd.append("ageRange", "AGE_0_2");
    fd.append("condition", "LIKE_NEW");
    fd.append("city", "Torino");
    fd.append("district", "Crocetta");
    fd.append("existingImagePaths", "img/a.jpg");
    fd.append("existingImagePaths", "img/b.jpg");
    fd.append("photosToRemove", "img/a.jpg");
    fd.append("newPhotos", fakePhoto("new.jpg"));

    const result = normalizeToyAdEditFormInput(fd);

    expect(result.title).toBe("Palla");
    expect(result.description).toBe("Come nuova");
    expect(result.ageRange).toBe("AGE_0_2");
    expect(result.condition).toBe("LIKE_NEW");
    expect(result.city).toBe("Torino");
    expect(result.district).toBe("Crocetta");
    expect(result.existingImagePaths).toEqual(["img/a.jpg", "img/b.jpg"]);
    expect(result.photosToRemove).toEqual(["img/a.jpg"]);
    expect(result.newPhotos).toHaveLength(1);
    expect(result.newPhotos[0].name).toBe("new.jpg");
  });

  it("returns empty arrays and empty strings when FormData has no entries", () => {
    const fd = new FormData();

    const result = normalizeToyAdEditFormInput(fd);

    expect(result.title).toBe("");
    expect(result.description).toBe("");
    expect(result.ageRange).toBe("");
    expect(result.condition).toBe("");
    expect(result.city).toBe("");
    expect(result.district).toBe("");
    expect(result.existingImagePaths).toEqual([]);
    expect(result.photosToRemove).toEqual([]);
    expect(result.newPhotos).toEqual([]);
  });
});
