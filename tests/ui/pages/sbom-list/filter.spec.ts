// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { SBOMListPage } from "../../helpers/Constants";
import { Navigation } from "../../helpers/Navigation";
import { Table } from "../../helpers/Table";
import { Toolbar } from "../../helpers/Toolbar";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");

    const toolbar = await Toolbar.build(page, SBOMListPage.toolbarAriaLabel);
    const table = await Table.build(page, SBOMListPage.tableAriaLabel);

    // Full search
    await toolbar.applyTextFilter(SBOMListPage.filters.filterText, "quarkus");
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Date filter
    await toolbar.applyDateRangeFilter(
      SBOMListPage.filters.createdOn,
      "11/21/2023",
      "11/23/2023"
    );
    await table.verifyColumnContainsText("Name", "quarkus-bom");

    // Labels filter
    await toolbar.applyLabelsFilter(SBOMListPage.filters.label, ["type=spdx"]);
    await table.verifyColumnContainsText("Name", "quarkus-bom");
  });
});
