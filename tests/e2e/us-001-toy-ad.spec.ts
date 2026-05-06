import { expect, test } from "@playwright/test";

test("US-001 - route nuovo annuncio e protetta per utenti non autenticati", async ({ page }) => {
  await page.goto("/dashboard/ads/new");
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test.fixme(
  "US-001 - pubblicazione annuncio happy path e error path con utente autenticato",
  "Richiede fixture di autenticazione Supabase in ambiente CI/dev."
);
