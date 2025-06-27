// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { PackageListPage } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");
  });

  test("Columns", async ({ page }) => {
    const toolbar = await Toolbar.build(page, PackageListPage.toolbarAriaLabel);
    const table = await Table.build(page, PackageListPage.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      PackageListPage.filters.filterText,
      "keycloak-core"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    await expect(
      table._table.locator(`td[data-label="Namespace"]`)
    ).toContainText("org.keycloak");

    await expect(
      table._table.locator(`td[data-label="Version"]`)
    ).toContainText("18.0.6.redhat-00001");

    await expect(table._table.locator(`td[data-label="Type"]`)).toContainText(
      "maven"
    );

    await expect(
      table._table.locator(`td[data-label="Qualifiers"]`)
    ).toContainText("type=jar");
    await expect(
      table._table.locator(`td[data-label="Qualifiers"]`)
    ).toContainText("repository_url=https://maven.repository.redhat.com/ga/");

    // Vulnerabilities
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='total']")
    ).toContainText("1");
    await expect(
      table._table
        .locator(`td[data-label="Vulnerabilities"]`)
        .locator("div[aria-label='medium']")
    ).toContainText("1");
  });
});
