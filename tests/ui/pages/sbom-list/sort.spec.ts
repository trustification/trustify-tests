// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { Navigation } from "../Navigation";
import { isSorted, SBOMListPage } from "../Constants";
import { Table } from "../Table";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Sort", async ({ page }) => {
    const table = await Table.build(page, SBOMListPage.tableAriaLabel);
    const columnNameSelector = table._table.locator(`td[data-label="Name"]`);

    const namesAsc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesAsc, true)).toBe(true);

    // Reverse sorting
    await table.clickSortBy("Name");
    const namesDesc = await columnNameSelector.allInnerTexts();

    expect(isSorted(namesDesc, false)).toBe(true);
  });
});
