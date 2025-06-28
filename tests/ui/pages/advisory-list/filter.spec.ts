// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { ListPage_Advisory } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Advisories");
  });

  test("Filters", async ({ page }) => {
    const toolbar = await Toolbar.build(
      page,
      ListPage_Advisory.toolbarAriaLabel
    );
    const table = await Table.build(page, ListPage_Advisory.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      ListPage_Advisory.filters.filterText,
      "CVE-2024-26308"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Date filter
    await toolbar.applyDateRangeFilter(
      ListPage_Advisory.filters.revision,
      "08/01/2024",
      "08/03/2024"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Labels filter
    await toolbar.applyLabelsFilter(ListPage_Advisory.filters.label, [
      "type=cve",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");
  });
});
