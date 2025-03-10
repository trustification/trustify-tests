import { Page } from "@playwright/test";

export const login = async (page: Page) => {
  let shouldLogin = process.env.TRUSTIFY_AUTH_ENABLED;

  if (shouldLogin === "true") {
    let userName = process.env.TRUSTIFY_AUTH_USER ?? "admin";
    let userPassword = process.env.TRUSTIFY_AUTH_PASSWORD ?? "admin";

    await page.goto("/");

    await page.fill('input[name="username"]:visible', userName);
    await page.fill('input[name="password"]:visible', userPassword);
    await page.keyboard.press("Enter");

    await page.waitForSelector("text=Your Dashboard"); // Ensure login was successful
  }
};
