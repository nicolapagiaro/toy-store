import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type FullConfig } from "@playwright/test";
import dotenv from "dotenv";

const AUTH_STATE_PATH = path.resolve(process.cwd(), "playwright/.auth/user.json");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function writeEmptyState() {
  await fs.mkdir(path.dirname(AUTH_STATE_PATH), { recursive: true });
  await fs.writeFile(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }, null, 2));
}

export default async function globalSetup(config: FullConfig) {
  const email = process.env.PLAYWRIGHT_E2E_EMAIL;
  const password = process.env.PLAYWRIGHT_E2E_PASSWORD;

  if (!email || !password) {
    await writeEmptyState();
    return;
  }

  const baseURL = config.projects[0]?.use?.baseURL ?? "http://127.0.0.1:3000";
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/auth/signin`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await page.waitForURL("**/dashboard", { timeout: 20_000 });

  await fs.mkdir(path.dirname(AUTH_STATE_PATH), { recursive: true });
  await page.context().storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
