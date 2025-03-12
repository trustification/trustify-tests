import { createBdd } from "playwright-bdd";
import { expect } from "playwright/test";
import { DetailsPage } from "../../helpers/DetailsPage";
import { ToolbarTable } from "../../helpers/ToolbarTable";

export const { Given, When, Then } = createBdd();

const PACKAGE_TABLE_NAME = "Package table";

Given(
  "User visits SBOM details Page of {string}",
  async ({ page }, sbomName) => {
    await page.goto("/");
    await page.getByRole("link", { name: "SBOMs" }).click();

    await page.getByPlaceholder("Search").click();
    await page.getByPlaceholder("Search").fill(sbomName);
    await page.getByPlaceholder("Search").press("Enter");

    await page.getByRole("link", { name: sbomName, exact: true }).click();
  }
);

Then("{string} is visible", async ({ page }, fieldName) => {
  await expect(page.locator(`[aria-label="${fieldName}"]`)).toBeVisible();
});

Then(
  "{string} action is invoked and downloaded filename is {string}",
  async ({ page }, actionName, expectedFilename) => {
    const downloadPromise = page.waitForEvent("download");

    const detailsPage = new DetailsPage(page);
    detailsPage.clickOnPageAction(actionName);

    const download = await downloadPromise;

    const filename = download.suggestedFilename();
    expect(filename).toEqual(expectedFilename);
  }
);

Then(
  "The Package table is sorted by {string}",
  async ({ page }, columnName) => {
    const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
    toolbarTable.verifyTableIsSortedBy(columnName);
  }
);

Then("Search by FilterText {string}", async ({ page }, filterText) => {
  const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
  await toolbarTable.filterByText(filterText);
});

Then(
  "The Package table total results is {int}",
  async ({ page }, totalResults) => {
    const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
    await toolbarTable.verifyPaginationHasTotalResults(totalResults);
  }
);

Then(
  "The Package table total results is greather than {int}",
  async ({ page }, totalResults) => {
    const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
    await toolbarTable.verifyPaginationHasTotalResultsGreatherThan(
      totalResults
    );
  }
);

Then(
  "The {string} column of the Package table table contains {string}",
  async ({ page }, columnName, expectedValue) => {
    const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
    await toolbarTable.verifyColumnContainsText(columnName, expectedValue);
  }
);
