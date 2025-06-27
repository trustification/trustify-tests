// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { AdvisoryListPage } from "../Constants";
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
      AdvisoryListPage.toolbarAriaLabel
    );
    const table = await Table.build(page, AdvisoryListPage.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(
      AdvisoryListPage.filters.filterText,
      "CVE-2024-26308"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Date filter
    await toolbar.applyDateRangeFilter(
      AdvisoryListPage.filters.revision,
      "08/01/2024",
      "08/03/2024"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");

    // Labels filter
    await toolbar.applyLabelsFilter(AdvisoryListPage.filters.label, [
      "type=cve",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", "CVE-2024-26308");
  });
});
