// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { ListPage_SBOM } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Vulnerabilities", async ({ page }) => {
    const toolbar = await Toolbar.build(page, ListPage_SBOM.toolbarAriaLabel);
    const table = await Table.build(page, ListPage_SBOM.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      ListPage_SBOM.filters.filterText,
      "quarkus-bom"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Total Vulnerabilities
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='total']", { hasText: "11" })
    ).toHaveCount(1);

    // Severities
    const expectedVulnerabilities = [
      {
        severity: "high",
        count: 1,
      },
      {
        severity: "medium",
        count: 9,
      },
      {
        severity: "none",
        count: 1,
      },
    ];

    for (const expectedVulnerability of expectedVulnerabilities) {
      await expect(
        table._table
          .locator(`td[data-label="Vulnerabilities"]`)
          .locator(`div[aria-label="${expectedVulnerability.severity}"]`, {
            hasText: expectedVulnerability.count.toString(),
          })
      ).toHaveCount(1);
    }
  });
});
