import { APP_CONFIG } from "../config/app.js";
import { chromium } from "playwright";
import { buildMetadataXpath } from "../helpers/xpath.js";

export const searchManga = async (args: { search: string }) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.setDefaultTimeout(APP_CONFIG.TIMEOUT);

  await page.goto(`${APP_CONFIG.BASE_URL}/mangas`);

  await page.waitForSelector("#didomi-notice-agree-button");
  await page.click("#didomi-notice-agree-button");

  await page.waitForSelector(".search_input_home");
  await page.fill(".search_input_home", args.search);
  await page.press(".search_input_home", "Enter");

  await page.waitForSelector("table.search.liste");

  const searchResults = await Promise.all(
    ((await page.$$("table.search.liste tbody tr")) || []).map(async (list) => {
      return {
        title: await list.$eval('[class="eTitre"]', (el) => el.textContent?.trim() || ""),
        link: await list.$eval('[class="eTitre"]', (el) => el.getAttribute("href") || ""),
        cover: await list.$eval("img", (el) => el.getAttribute("src") || ""),
      };
    }),
  );

  await browser.close();

  return searchResults;
};
