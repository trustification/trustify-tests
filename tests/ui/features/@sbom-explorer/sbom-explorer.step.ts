import { createBdd } from "playwright-bdd";
import { expect } from "playwright/test";
import { DetailsPage } from "../../helpers/DetailsPage";
import { Toolbar } from "../../helpers/Toolbar";
import { Table } from "../../helpers/Table";
import { Pagination } from "../../helpers/Pagination";
import { Navigation } from "../../helpers/Navigation";
import { SbomDetailsPage } from "../../helpers/SbomDetailsPage";
import { SBOMListPage } from "../../helpers/Constants";

export const { Given, When, Then } = createBdd();

const PACKAGE_TABLE_NAME = "Package table";
const VULN_TABLE_NAME = "Vulnerability table";

Given(
  "An ingested {string} SBOM {string} is available",
  async ({ page }, _sbomType, sbomName) => {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");

    const toolbar = await Toolbar.build(page, SBOMListPage.toolbarAriaLabel);
    await toolbar.applyTextFilter(SBOMListPage.filters.filterText, sbomName);

    const table = await Table.build(page, SBOMListPage.tableAriaLabel);
    await table.verifyTableHasData();
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
    const table = await Table.build(page, PACKAGE_TABLE_NAME);
    await table.verifyTableIsSortedBy(columnName);
  }
);

Then("Search by FilterText {string}", async ({ page }, filterText) => {
  const toolbar = await Toolbar.build(page, "Package toolbar");
  await toolbar.applyTextFilter("Filter text", filterText);
});

Then(
  "The Package table total results is {int}",
  async ({ page }, totalResults) => {
    const table = await Table.build(page, PACKAGE_TABLE_NAME);
    if (totalResults > 0) {
      await table.verifyTableHasData();
    } else {
      await table.verifyTableHasNoData();
    }

    const pagination = await Pagination.build(
      page,
      "package-table-pagination-top"
    );
    const total = await pagination.getTotalNumberOfItems();
    expect(total).toBe(totalResults);
  }
);

Then(
  "The Package table total results is greater than {int}",
  async ({ page }, totalResults) => {
    const pagination = await Pagination.build(
      page,
      "package-table-pagination-top"
    );
    const total = await pagination.getTotalNumberOfItems();
    expect(total).toBeGreaterThan(totalResults);
  }
);

Then(
  "The {string} column of the Package table table contains {string}",
  async ({ page }, columnName, expectedValue) => {
    const table = await Table.build(page, PACKAGE_TABLE_NAME);
    await table.verifyColumnContainsText(columnName, expectedValue);
  }
);

Given(
  "An ingested {string} SBOM {string} containing Vulnerabilities",
  async ({ page }, _sbomType, sbomName) => {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");

    const toolbar = await Toolbar.build(page, SBOMListPage.toolbarAriaLabel);
    await toolbar.applyTextFilter(SBOMListPage.filters.filterText, sbomName);

    const table = await Table.build(page, SBOMListPage.tableAriaLabel);
    const element = table._table.locator(
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
    const sbomDetailsPage = new SbomDetailsPage(page);
    await sbomDetailsPage.verifyVulnerabilityPanelcount();
  }
);

Then(
  "SBOM Name {string} should be visible inside the tab",
  async ({ page }, sbomName) => {
    const panelSbomName = page.locator(
      `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Name')]/following-sibling::dd`
    );
    await panelSbomName.isVisible();
    expect(await panelSbomName.textContent()).toEqual(sbomName);
  }
);

Then("SBOM Version should be visible inside the tab", async ({ page }) => {
  const panelSBOMVersion = page.locator(
    `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Version')]/following-sibling::dd`
  );
  await panelSBOMVersion.isVisible();
});

Then(
  "SBOM Creation date should be visible inside the tab",
  async ({ page }) => {
    const panelSBOMVersion = page.locator(
      `xpath=//section[@id='refVulnerabilitiesSection']//dt[contains(.,'Creation date')]/following-sibling::dd`
    );
    await panelSBOMVersion.isVisible();
  }
);

Then(
  "List of related Vulnerabilities should be sorted by {string} in descending order",
  async ({ page }, columnName) => {
    const table = await Table.build(page, VULN_TABLE_NAME);
    await table.verifyTableIsSortedBy(columnName, false);
  }
);

Then("Pagination of Vulnerabilities list works", async ({ page }) => {
  const pagination = await Pagination.build(
    page,
    "vulnerability-table-pagination-top"
  );
  await pagination.verifyPagination();
});

Then("Pagination of Packages list works", async ({ page }) => {
  const pagination = await Pagination.build(
    page,
    "package-table-pagination-top"
  );
  await pagination.verifyPagination();
});
