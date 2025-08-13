import { createBdd } from "playwright-bdd";
import { ToolbarTable } from "../../helpers/ToolbarTable";
import { SearchPage } from "../../helpers/SearchPage";
import { expect } from "@playwright/test";

export const { Given, When, Then } = createBdd();

const VULNERABILITIES_TABLE_NAME = "vulnerability table";

Given(
  "User visits Advisory details Page of {string}",
  async ({ page }, advisoryID) => {
    const searchPage = new SearchPage(page, "Advisories");
    await searchPage.dedicatedSearch(advisoryID);
    await page.getByRole("link", { name: advisoryID }).click();
  }
);

// Advisory Search
When(
  "User searches for an advisory named {string} in the general search bar",
  async ({ page }, item) => {
    const searchPage = new SearchPage(page, "Dashboard");
    await searchPage.generalSearch("Advisories", item);
  }
);

When(
  "User searches for {string} in the dedicated search bar",
  async ({ page }, advisoryID) => {
    const searchPage = new SearchPage(page, "Advisories");
    await searchPage.dedicatedSearch(advisoryID);
  }
);

Then(
  "The advisory {string} shows in the results",
  async ({ page }, advisoryID) => {
    await expect(
      page.getByRole("gridcell").filter({ hasText: advisoryID })
    ).toBeVisible();
  }
);

// Advisory Explorer
Then(
  "The vulnerabilities table is sorted by {string}",
  async ({ page }, columnName) => {
    const toolbarTable = new ToolbarTable(page, VULNERABILITIES_TABLE_NAME);
    await toolbarTable.verifyTableIsSortedBy(columnName);
  }
);

Then(
  "The vulnerabilities table total results is {int}",
  async ({ page }, totalResults) => {
    const toolbarTable = new ToolbarTable(page, VULNERABILITIES_TABLE_NAME);
    await toolbarTable.verifyPaginationHasTotalResults(totalResults);
  }
);

Then(
  "The {string} column of the vulnerability table contains {string}",
  async ({ page }, columnName, expectedValue) => {
    const toolbarTable = new ToolbarTable(page, VULNERABILITIES_TABLE_NAME);
    await toolbarTable.verifyColumnContainsText(columnName, expectedValue);
  }
);
