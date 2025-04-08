import { createBdd } from "playwright-bdd";
import { expect } from "playwright/test";
import { DetailsPage } from "../../helpers/DetailsPage";
import { ToolbarTable } from "../../helpers/ToolbarTable";
import { SearchPage } from "../../helpers/SearchPage";

export const { Given, When, Then } = createBdd();

const PACKAGE_TABLE_NAME = "Package table";
const VULN_TABLE_NAME = "Vulnerability table";

Given(
  "An ingested {string} SBOM {string} is available",
  async ({ page }, _sbomType, sbomName) => {
    const searchPage = new SearchPage(page);
    await searchPage.dedicatedSearch("SBOMs", sbomName);
  }
);

When(
  "User visits SBOM details Page of {string}",
  async ({ page }, sbomName) => {
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
    await detailsPage.clickOnPageAction(actionName);

    const download = await downloadPromise;

    const filename = download.suggestedFilename();
    expect(filename).toEqual(expectedFilename);
  }
);

Then(
  "The Package table is sorted by {string}",
  async ({ page }, columnName) => {
    const toolbarTable = new ToolbarTable(page, PACKAGE_TABLE_NAME);
    await toolbarTable.verifyTableIsSortedBy(columnName);
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

Given(
  "An ingested {string} SBOM {string} containing Vulnerabilities",
  async ({ page }, _sbomType, sbomName) => {
    const searchPage = new SearchPage(page);
    await searchPage.dedicatedSearch("SBOMs", sbomName);
    const element = await page.locator(
      `xpath=(//tr[contains(.,'${sbomName}')]/td[@data-label='Vulnerabilities']/div)[1]`
    );
    await expect(element, "SBOM have no vulnerabilities").toHaveText(
      /^(?!0$).+/
    );
  }
);

When("User Clicks on Vulnerabilities Tab Action", async ({ page }) => {
  await page.getByLabel("Tab action").click();
});

Then("Vulnerability Popup menu appears with message", async ({ page }) => {
  await page.getByText("Any found vulnerabilities").isVisible();
  await page.getByLabel("Close").click();
});

Then(
  "Vulnerability Risk Profile circle should be visible",
  async ({ page }) => {
    await page.locator(`xpath=//div[contains(@class, 'chart')]`).isVisible();
  }
);

Then(
  "Vulnerability Risk Profile shows summary of vulnerabilities",
  async ({ page }) => {
    const detailsPage = new DetailsPage(page);
    await detailsPage.verifyVulnerabilityPanelcount();
  }
);

Then(
  "SBOM Name {string} should be visible inside the tab",
  async ({ page }, sbomName) => {
    const panelSbomName = await page.locator(
      `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Name')]/following-sibling::dd`
    );
    await panelSbomName.isVisible();
    await expect(await panelSbomName.textContent()).toEqual(sbomName);
  }
);

Then("SBOM Version should be visible inside the tab", async ({ page }) => {
  const panelSBOMVersion = await page.locator(
    `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Version')]/following-sibling::dd`
  );
  await panelSBOMVersion.isVisible();
});

Then(
  "SBOM Creation date should be visible inside the tab",
  async ({ page }) => {
    const panelSBOMVersion = await page.locator(
      `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Creation date')]/following-sibling::dd`
    );
    await panelSBOMVersion.isVisible();
  }
);

Then(
  "List of related Vulnerabilities should be sorted by {string} in descending order",
  async ({ page }, columnName) => {
    const toolbarTable = new ToolbarTable(page, VULN_TABLE_NAME);
    await toolbarTable.verifyTableIsSortedBy(columnName, false);
  }
);
