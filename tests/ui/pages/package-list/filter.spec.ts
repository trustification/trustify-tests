// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { ListPage_Package } from "../Constants";
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
    const toolbar = await Toolbar.build(page, ListPage_Package.toolbarAriaLabel);
    const table = await Table.build(page, ListPage_Package.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      ListPage_Package.filters.filterText,
      "keycloak-core"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Type filter
    await toolbar.applyMultiSelectFilter(ListPage_Package.filters.type, [
      "Maven",
      "RPM",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "keycloak-core");

    // Architecture
    await toolbar.applyMultiSelectFilter(ListPage_Package.filters.architecture, [
      "S390",
      "No Arch",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyTableHasNoData();
  });
});
