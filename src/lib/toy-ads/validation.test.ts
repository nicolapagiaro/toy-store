import { describe, expect, it } from "vitest";
import { validateToyAdInput } from "./validation";

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
