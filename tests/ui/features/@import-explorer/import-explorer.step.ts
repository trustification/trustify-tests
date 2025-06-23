import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { ToolbarTable } from "../../helpers/ToolbarTable";

export const { Given, When, Then } = createBdd();

const IMPORTER_TABLE_NAME = "Importer table";

Given(
  "the user navigates to TPA URL page successfully",
  async ({ page }) => {
    await page.locator(`xpath=//div@class='pf-v5-c-card__title-text' and text()="Dashboard"]`).isVisible();
  }
);

When(
  "the user is on Importer Explorer page",
  async ({ page }) => {
    await page.getByRole("link", { name: "Importers", exact: true }).click();
    // Wait until the table itself is rendered.
    await expect(page.locator(`[aria-label="Importer table"]`)).toBeVisible();
  }
);

Then(
  "the importers page should be displayed with pagination controls with correct values",
  async ({ page }) => {
    const topPagination = page.locator("#importer-table-pagination-top");
    const bottomPagination = page.locator("#importer-table-pagination-bottom");

    // Pagination controls are visible
    await expect(topPagination).toBeVisible();
    await expect(bottomPagination).toBeVisible();

    // Get the pagination text (e.g., "1–5 of 5")
    const label = await topPagination.locator("text=/\\d+–\\d+ of \\d+/").innerText();
    const match = label.match(/(\d+)–(\d+) of (\d+)/);

    expect(match).not.toBeNull();

    const start = parseInt(match![1], 10);
    const end = parseInt(match![2], 10);
    const total = parseInt(match![3], 10);

    // Count visible table rows
    const rowCount = await page.locator("[aria-label='Importer table'] tbody tr").count();

    // Validate that row count = end - start + 1
    expect(rowCount).toBe(end - start + 1);

    // Validate page size dropdown matches end - start + 1
    const selectedPageSize = await page.locator
      ("xpath=//div[contains(@class,'pf-v6-c-pagination__page-menu')]//button[contains(@id, 'pagination-id-bottom-toggle')]")
      .innerText();

    expect(parseInt(selectedPageSize)).toBe(end - start + 1);

    // Validate "current page number" field equals 1
    const pageNumberInput = await page.locator(
      "xpath=//div[contains(@aria-label='Current page')]//input[@type='number']"
    );
    await expect(pageNumberInput).toHaveValue("1");

    // Validate navigation buttons are disabled if only one page
    if (total <= end) {
      await expect(page.locator("xpath=//div[@class='pf-v6-c-pagination__nav-control']//button[aria-label='Go to next page']")).toBeDisabled();
    } else {
      await expect(page.locator("xpath=//div[@class='pf-v6-c-pagination__nav-control']//button[aria-label='Go to next page']")).toBeEnabled();
    }
  }
);

Then(
  "it should be possible to move between pages accordingly",
  async ({ page }) => {
    const toolbarTable = new ToolbarTable(page, IMPORTER_TABLE_NAME);
    const topPagination = `xpath=//div[@id="importer-table-pagination-top"]`;

    await toolbarTable.verifyPagination(topPagination);
  }
);

Then(
  "it should be possible to add page numbers in the pagination text box and pressing Enter to move to the desired page",
  async ({ page }) => {
    const toolbarTable = new ToolbarTable(page, "Importer table");
    await toolbarTable.verifyPageJumpWithInput("#importer-table-pagination-top");
  }
);
