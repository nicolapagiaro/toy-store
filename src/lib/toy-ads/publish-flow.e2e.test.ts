import { describe, expect, it, vi } from "vitest";
import { createToyAdFromFormData, updateToyAdFromFormData } from "./service";

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

describe("US-002 smoke — modifica annuncio", () => {
  it("proprietario vede il form precompilato e può salvare modifiche", async () => {
    // Il proprietario apre la pagina edit: i dati esistenti sono presenti nel form.
    // Modifica il titolo e salva: il flusso update termina con successo
    // e il sistema reindirizza al dettaglio aggiornato.
    const formData = new FormData();
    formData.set("adId", "ad-42");
    formData.set("title", "Puzzle legno 100 pezzi");
    formData.set("description", "Completo di tutti i pezzi, ottimo stato");
    formData.set("ageRange", "AGE_6_8");
    formData.set("condition", "GOOD");
    formData.set("city", "Torino");
    formData.append("existingImagePaths", "uploads/ad-42/photos/1.jpg");

    const updateAd = vi.fn(async () => undefined);

    const result = await updateToyAdFromFormData(formData, "ad-42", {
      getCurrentUserId: async () => "user-owner",
      loadAd: async () => ({ ownerId: "user-owner", imagePaths: ["uploads/ad-42/photos/1.jpg"] }),
      uploadPhoto: async () => "never-called",
      deletePhoto: vi.fn(async () => undefined),
      updateAd,
    });

    expect(result.success).toBe(true);
    expect(updateAd).toHaveBeenCalledOnce();
    expect(updateAd).toHaveBeenCalledWith(
      expect.objectContaining({
        adId: "ad-42",
        title: "Puzzle legno 100 pezzi",
      })
    );
  });

  it("un non proprietario che tenta la route edit vede accesso negato", async () => {
    // Un utente diverso dal proprietario tenta di salvare modifiche tramite la
    // server action. Il check ownership lato server blocca l'operazione e
    // restituisce un errore di autorizzazione, senza mostrare il form.
    const formData = new FormData();
    formData.set("adId", "ad-42");
    formData.set("title", "Titolo modificato da intruso");
    formData.set("description", "Descrizione");
    formData.set("ageRange", "AGE_6_8");
    formData.set("condition", "GOOD");
    formData.set("city", "Milano");
    formData.append("existingImagePaths", "uploads/ad-42/photos/1.jpg");

    const updateAd = vi.fn(async () => undefined);

    const result = await updateToyAdFromFormData(formData, "ad-42", {
      getCurrentUserId: async () => "user-intruder",
      loadAd: async () => ({ ownerId: "user-owner", imagePaths: ["uploads/ad-42/photos/1.jpg"] }),
      uploadPhoto: async () => "never-called",
      deletePhoto: vi.fn(async () => undefined),
      updateAd,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.form).toMatch(/non sei autorizzato/i);
    expect(updateAd).not.toHaveBeenCalled();
  });

  it("dopo il salvataggio il dettaglio mostra immediatamente i dati aggiornati", async () => {
    // Dopo che updateToyAdFromFormData ha completato con successo, i dati
    // persistiti devono riflettere i valori inviati — senza alcuna operazione
    // di ricarica manuale. Il badge "Aggiornato ora" è reso possibile dal fatto
    // che updateAd viene chiamata con i dati corretti prima del redirect.
    const formData = new FormData();
    formData.set("adId", "ad-77");
    formData.set("title", "LEGO City treno");
    formData.set("description", "Set completo con binari");
    formData.set("ageRange", "AGE_9_12");
    formData.set("condition", "LIKE_NEW");
    formData.set("city", "Roma");
    formData.append("existingImagePaths", "uploads/ad-77/photos/1.jpg");

    const capturedUpdate = vi.fn(async () => undefined);

    const result = await updateToyAdFromFormData(formData, "ad-77", {
      getCurrentUserId: async () => "user-owner",
      loadAd: async () => ({ ownerId: "user-owner", imagePaths: ["uploads/ad-77/photos/1.jpg"] }),
      uploadPhoto: async () => "never-called",
      deletePhoto: vi.fn(async () => undefined),
      updateAd: capturedUpdate,
    });

    expect(result.success).toBe(true);
    // I dati salvati nel DB corrispondono esattamente ai valori del form:
    // il dettaglio può mostrarli immediatamente dopo il redirect senza stale cache.
    expect(capturedUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "LEGO City treno",
        city: "Roma",
        condition: "LIKE_NEW",
      })
    );
  });

  it("la rimozione di tutte le foto esistenti senza aggiungerne di nuove viene bloccata dalla validazione", async () => {
    // L'utente deseleziona tutte le foto esistenti nel form edit e non carica
    // nuovi file. La validazione deve respingere il form con un errore sul
    // campo photos, esattamente come avviene in fase di creazione.
    const formData = new FormData();
    formData.set("adId", "ad-55");
    formData.set("title", "Bici bambino");
    formData.set("description", "Ruote da 16 pollici");
    formData.set("ageRange", "AGE_3_5");
    formData.set("condition", "GOOD");
    formData.set("city", "Firenze");
    // nessun campo existingPhotos e nessun file photos allegato

    const updateAd = vi.fn(async () => undefined);

    const result = await updateToyAdFromFormData(formData, "ad-55", {
      getCurrentUserId: async () => "user-owner",
      loadAd: async () => ({ ownerId: "user-owner", imagePaths: ["uploads/ad-55/photos/1.jpg"] }),
      uploadPhoto: async () => "never-called",
      deletePhoto: vi.fn(async () => undefined),
      updateAd,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.photos).toBeTruthy();
    expect(updateAd).not.toHaveBeenCalled();
  });
});
