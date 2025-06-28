// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { ListPage_Advisory } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

test.describe("Columns validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Advisories");
  });

  test("Columns", async ({ page }) => {
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

    await expect(table._table.locator(`td[data-label="Title"]`)).toContainText(
      "Apache Commons Compress: OutOfMemoryError unpacking broken Pack200 file"
    );

    await expect(table._table.locator(`td[data-label="Type"]`)).toContainText(
      "cve"
    );

    await expect(table._table.locator(`td[data-label="Labels"]`)).toContainText(
      "type=cve"
    );
  });
});
