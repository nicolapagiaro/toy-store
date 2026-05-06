import { describe, expect, it, vi } from "vitest";
import { createToyAdFromFormData } from "./service";

describe("toy ad publish flow", () => {
  it("fails with contextual errors and then succeeds after correction", async () => {
    const invalid = new FormData();
    invalid.set("title", "");
    invalid.set("description", "");
    invalid.set("ageRange", "");
    invalid.set("condition", "");
    invalid.set("city", "");

    const invalidResult = await createToyAdFromFormData(invalid, {
      getCurrentUserId: async () => "user-1",
      uploadPhoto: async () => "never",
      saveAd: async () => undefined,
    });

    expect(invalidResult.success).toBe(false);
    if (invalidResult.success) return;
    expect(invalidResult.errors.title).toBeTruthy();
    expect(invalidResult.errors.photos).toBeTruthy();

    const valid = new FormData();
    valid.set("title", "Puzzle legno");
    valid.set("description", "Completo di tutti i pezzi");
    valid.set("ageRange", "AGE_6_8");
    valid.set("condition", "GOOD");
    valid.set("city", "Torino");
    valid.append("photos", new File(["img"], "puzzle.jpg", { type: "image/jpeg" }));

    const saveAd = vi.fn(async () => undefined);

    const validResult = await createToyAdFromFormData(valid, {
      getCurrentUserId: async () => "user-1",
      uploadPhoto: async () => "uploads/puzzle.jpg",
      saveAd,
    });

    expect(validResult.success).toBe(true);
    expect(saveAd).toHaveBeenCalledOnce();
  });
});
