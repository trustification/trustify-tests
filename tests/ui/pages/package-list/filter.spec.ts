// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { PackageListPage } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");
  });

  test("Filters", async ({ page }) => {
    const toolbar = await Toolbar.build(page, PackageListPage.toolbarAriaLabel);
    const table = await Table.build(page, PackageListPage.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      PackageListPage.filters.filterText,
      "keycloak-core"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Type filter
    await toolbar.applyMultiSelectFilter(PackageListPage.filters.type, [
      "Maven",
      "RPM",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Architecture
    await toolbar.applyMultiSelectFilter(PackageListPage.filters.architecture, [
      "S390",
      "No Arch",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyTableHasNoData();
  });
});
