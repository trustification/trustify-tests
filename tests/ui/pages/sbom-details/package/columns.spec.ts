// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { PackageTab } from "./PackageTab";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Vulnerabilities", async ({ page }) => {
    const packageTab = await PackageTab.build(page, "quarkus-bom");

    const toolbar = await packageTab.getToolbar();
    const table = await packageTab.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "commons-compress");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");

    // Name
    await expect(table._table.locator(`td[data-label="Name"]`)).toContainText(
      "commons-compress"
    );

    // Version
    await expect(
      table._table.locator(`td[data-label="Version"]`)
    ).toContainText("1.21.0.redhat-00001");

    // Vulnerabilities
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='total']")
    ).toContainText("1");

    // Licenses
    await expect(
      table._table.locator(`td[data-label="Licenses"]`)
    ).toContainText("2 Licenses");

    await table._table.locator(`td[data-label="Licenses"]`).click();

    await expect(
      table._table.locator(`td[data-label="Licenses"]`).nth(1)
    ).toContainText("Apache-2.0");
    await expect(
      table._table.locator(`td[data-label="Licenses"]`).nth(1)
    ).toContainText("NOASSERTION");

    // PURL
    await expect(table._table.locator(`td[data-label="PURLs"]`)).toContainText(
      "pkg:maven/org.apache.commons/commons-compress@1.21.0.redhat-00001?repository_url=https://maven.repository.redhat.com/ga/&type=jar"
    );

    // CPE
    await expect(table._table.locator(`td[data-label="CPEs"]`)).toContainText(
      "0 CPEs"
    );
  });
});
