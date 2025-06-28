// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { isSorted } from "../Constants";
import { AdvisoryListPage } from "./AdvisoryListPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // skipped until it is fixed in the backend. It is bug, fix it
  test.skip("Sort", async ({ page }) => {
    const listPage = await AdvisoryListPage.build(page);
    const table = await listPage.getTable();

    const columnNameSelector = table._table.locator(`td[data-label="ID"]`);

    // ID Asc
    await table.clickSortBy("ID");
    const namesAsc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesAsc, true), "").toBe(true);

    // ID Desc
    await table.clickSortBy("ID");
    const namesDesc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesDesc, false)).toBe(true);
  });
});
