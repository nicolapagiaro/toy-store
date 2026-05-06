import { describe, expect, it, vi } from "vitest";
import { createToyAdFromFormData } from "./service";

function buildValidFormData() {
  const formData = new FormData();
  formData.set("title", "Triciclo evolutivo");
  formData.set("description", "Usato poco");
  formData.set("ageRange", "AGE_3_5");
  formData.set("condition", "EXCELLENT");
  formData.set("city", "Milano");
  formData.set("district", "Niguarda");
  formData.append("photos", new File(["a"], "one.jpg", { type: "image/jpeg" }));
  return formData;
}

describe("createToyAdFromFormData", () => {
  it("creates ad with uploaded paths when input is valid", async () => {
    const uploadPhoto = vi.fn(async ({ index }: { index: number }) => `uploads/path-${index + 1}.jpg`);
    const saveAd = vi.fn(async () => undefined);

    const result = await createToyAdFromFormData(buildValidFormData(), {
      getCurrentUserId: async () => "user-1",
      uploadPhoto,
      saveAd,
    });

    expect(result.success).toBe(true);
    expect(uploadPhoto).toHaveBeenCalledTimes(1);
    expect(saveAd).toHaveBeenCalledTimes(1);
    expect(saveAd.mock.calls[0][0].imagePaths).toEqual(["uploads/path-1.jpg"]);
  });

  it("blocks creation when no authenticated user is available", async () => {
    const result = await createToyAdFromFormData(buildValidFormData(), {
      getCurrentUserId: async () => null,
      uploadPhoto: async () => "never",
      saveAd: async () => undefined,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.form).toContain("Sessione scaduta");
  });

  it("returns upload error when storage fails", async () => {
    const result = await createToyAdFromFormData(buildValidFormData(), {
      getCurrentUserId: async () => "user-1",
      uploadPhoto: async () => {
        throw new Error("storage down");
      },
      saveAd: async () => undefined,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.photos).toContain("Errore durante il caricamento foto");
  });
});
