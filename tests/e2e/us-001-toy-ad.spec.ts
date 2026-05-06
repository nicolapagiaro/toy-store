import { expect, test } from "@playwright/test";

test("US-001 - route nuovo annuncio e protetta per utenti non autenticati", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/dashboard/ads/new");
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test.describe("US-001 autenticato", () => {
  test.skip(
    !process.env.PLAYWRIGHT_E2E_EMAIL || !process.env.PLAYWRIGHT_E2E_PASSWORD,
    "Imposta PLAYWRIGHT_E2E_EMAIL e PLAYWRIGHT_E2E_PASSWORD per eseguire i test autenticati."
  );

  test("blocca pubblicazione e mostra errori contestuali con campi mancanti", async ({ page }) => {
    await page.goto("/dashboard/ads/new");
    await page.getByRole("button", { name: "Pubblica annuncio" }).click();

    await expect(page.getByText("Non e stato possibile pubblicare")).toBeVisible();
    await expect(page.getByText("Inserisci un titolo per l'annuncio.")).toBeVisible();
    await expect(page.getByText("Aggiungi almeno una foto reale del giocattolo prima di pubblicare.")).toBeVisible();
  });

  test("pubblica annuncio valido e apre il dettaglio", async ({ page }) => {
    await page.goto("/dashboard/ads/new");

    await page.fill("#title", "Triciclo evolutivo e richiudibile");
    await page.fill("#description", "Usato poco, completo di cestino e maniglione.");
    await page.selectOption("#ageRange", "AGE_3_5");
    await page.selectOption("#condition", "EXCELLENT");
    await page.fill("#city", "Milano");
    await page.fill("#district", "Niguarda");

    await page.setInputFiles('input[name="photos"]', {
      name: "toy.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from([255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 255, 217]),
    });

    await page.getByRole("button", { name: "Pubblica annuncio" }).click();

    await expect(page).toHaveURL(/\/dashboard\/ads\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Il tuo annuncio|Annuncio aggiornato con successo/
    );
    await expect(page.getByText("Triciclo evolutivo e richiudibile")).toBeVisible();
  });
});
