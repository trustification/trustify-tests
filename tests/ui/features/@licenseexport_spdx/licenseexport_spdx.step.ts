import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { SearchPage } from "../../helpers/SearchPage";

export const { Given, When, Then } = createBdd();


Given(
  'User searches for SBOM "{string}" in the SBOMs tab',
  async ({ page }, sbomName: string) => {
    const searchPage = new SearchPage(page);
    await searchPage.dedicatedSearch("SBOMs", sbomName); // helper you already use
  }
);

When(
  'User selects SBOM "{string}" from the search results',
  async ({ page }, sbomName: string) => {
    // Row is selected; adjust selector if row/checkbox semantics differ
    await page
      .getByRole("row", { name: new RegExp(`^${sbomName}$`, "i") })
      .click();
  }
);

When('User clicks the "Action" button', async ({ page }) => {
  await page.getByRole("button", { name: /^Action$/i }).click();
});

Then(
  'The "Download License Report" option is visible',
  async ({ page }) => {
    await expect(
      page.getByRole("menuitem", { name: /^Download License Report$/i })
    ).toBeVisible();
  }
);
