// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { isSorted, ListPage_Package } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");
  });

  test("Sort", async ({ page }) => {
    const table = await Table.build(page, ListPage_Package.tableAriaLabel);
    const columnNameSelector = table._table.locator(`td[data-label="ID"]`);

    // ID Asc
    const namesAsc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesAsc, true)).toBe(true);

    // ID Desc
    await table.clickSortBy("Name");
    const namesDesc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesDesc, false)).toBe(true);
  });
});
