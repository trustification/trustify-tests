// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { isSorted } from "../Constants";
import { SbomListPage } from "./SbomListPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const listPage = await SbomListPage.build(page);
    const table = await listPage.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="Name"]`);

    const namesAsc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesAsc, true)).toBe(true);

    // Reverse sorting
    await table.clickSortBy("Name");
    const namesDesc = await columnNameSelector.allInnerTexts();

    expect(isSorted(namesDesc, false)).toBe(true);
  });
});
