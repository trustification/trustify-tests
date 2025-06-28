// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { ListPage_SBOM } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Filters", async ({ page }) => {
    const toolbar = await Toolbar.build(page, ListPage_SBOM.toolbarAriaLabel);
    const table = await Table.build(page, ListPage_SBOM.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(ListPage_SBOM.filters.filterText, "quarkus");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Date filter
    await toolbar.applyDateRangeFilter(
      ListPage_SBOM.filters.createdOn,
      "11/21/2023",
      "11/23/2023"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Labels filter
    await toolbar.applyLabelsFilter(ListPage_SBOM.filters.label, ["type=spdx"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "quarkus-bom");
  });
});
