import { describe, expect, it, vi } from "vitest";
import { updateToyAdFromFormData } from "./service";

function buildValidEditFormData() {
  const formData = new FormData();
  formData.set("title", "Triciclo");
  formData.set("description", "Usato poco, ottimo stato");
  formData.set("ageRange", "AGE_3_5");
  formData.set("condition", "EXCELLENT");
  formData.set("city", "Milano");
  formData.set("district", "Niguarda");
  formData.append("existingImagePaths", "toy-ad/abc/photos/1.jpg");
  return formData;
}

function buildDefaultDependencies() {
  return {
    getCurrentUserId: vi.fn(async () => "user-1"),
    loadAd: vi.fn(async () => ({
      ownerId: "user-1",
      imagePaths: ["toy-ad/abc/photos/1.jpg"],
    })),
    uploadPhoto: vi.fn(async ({ index }: { index: number }) => `uploads/new-${index}.jpg`),
    deletePhoto: vi.fn(async () => undefined),
    updateAd: vi.fn(async () => undefined),
  };
}

describe("updateToyAdFromFormData", () => {
  it("returns session error when getCurrentUserId returns null", async () => {
    const deps = buildDefaultDependencies();
    deps.getCurrentUserId = vi.fn(async () => null);

    const result = await updateToyAdFromFormData(buildValidEditFormData(), "ad-123", deps);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.form).toContain("Sessione scaduta");
  });

  it("returns not-found error when loadAd returns null", async () => {
    const deps = buildDefaultDependencies();
    deps.loadAd = vi.fn(async () => null);

    const result = await updateToyAdFromFormData(buildValidEditFormData(), "ad-123", deps);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.form).toContain("Annuncio non trovato");
  });

  it("returns authorization error when current user is not the owner", async () => {
    const deps = buildDefaultDependencies();
    deps.loadAd = vi.fn(async () => ({
      ownerId: "other-user",
      imagePaths: ["toy-ad/abc/photos/1.jpg"],
    }));

    const result = await updateToyAdFromFormData(buildValidEditFormData(), "ad-123", deps);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.form).toContain("Non sei autorizzato");
  });

  it("returns validation errors when title is empty", async () => {
    const deps = buildDefaultDependencies();
    const formData = buildValidEditFormData();
    formData.set("title", "");

    const result = await updateToyAdFromFormData(formData, "ad-123", deps);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.title).toBeDefined();
  });

  it("keeps existing photos without calling uploadPhoto or deletePhoto", async () => {
    const deps = buildDefaultDependencies();

    const result = await updateToyAdFromFormData(buildValidEditFormData(), "ad-123", deps);

    expect(result.success).toBe(true);
    expect(deps.uploadPhoto).not.toHaveBeenCalled();
    expect(deps.deletePhoto).not.toHaveBeenCalled();
    expect(deps.updateAd).toHaveBeenCalledTimes(1);
    expect(deps.updateAd.mock.calls[0][0].imagePaths).toEqual(["toy-ad/abc/photos/1.jpg"]);
  });

  it("calls uploadPhoto and includes new path when a new photo is added", async () => {
    const deps = buildDefaultDependencies();
    const formData = buildValidEditFormData();
    formData.append("newPhotos", new File(["a"], "new.jpg", { type: "image/jpeg" }));

    const result = await updateToyAdFromFormData(formData, "ad-123", deps);

    expect(result.success).toBe(true);
    expect(deps.uploadPhoto).toHaveBeenCalledTimes(1);
    expect(deps.updateAd).toHaveBeenCalledTimes(1);
    const imagePaths: string[] = deps.updateAd.mock.calls[0][0].imagePaths;
    expect(imagePaths).toContain("toy-ad/abc/photos/1.jpg");
    expect(imagePaths.some((p) => p.startsWith("uploads/new-"))).toBe(true);
  });

  it("calls deletePhoto for removed photos and excludes them from updateAd", async () => {
    const deps = buildDefaultDependencies();
    deps.loadAd = vi.fn(async () => ({
      ownerId: "user-1",
      imagePaths: ["toy-ad/abc/photos/1.jpg", "toy-ad/abc/photos/2.jpg"],
    }));
    // existingImagePaths only contains "1.jpg" — "2.jpg" is removed
    const formData = buildValidEditFormData();

    const result = await updateToyAdFromFormData(formData, "ad-123", deps);

    expect(result.success).toBe(true);
    expect(deps.deletePhoto).toHaveBeenCalledTimes(1);
    expect(deps.deletePhoto).toHaveBeenCalledWith("toy-ad/abc/photos/2.jpg");
    expect(deps.updateAd.mock.calls[0][0].imagePaths).not.toContain("toy-ad/abc/photos/2.jpg");
  });

  it("returns upload error when uploadPhoto throws", async () => {
    const deps = buildDefaultDependencies();
    deps.uploadPhoto = vi.fn(async () => {
      throw new Error("storage down");
    });
    const formData = buildValidEditFormData();
    formData.append("newPhotos", new File(["a"], "new.jpg", { type: "image/jpeg" }));

    const result = await updateToyAdFromFormData(formData, "ad-123", deps);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.photos).toContain("Errore durante l'aggiornamento");
  });
});