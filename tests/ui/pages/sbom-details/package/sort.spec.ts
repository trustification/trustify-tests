// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { DetailsPage_SBOM, isSorted } from "../../Constants";
import { Table } from "../../Table";
import { SbomDetailsPage } from "../SbomDetailsPage";

test.describe("Sort validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Sort", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");
    await detailsPage._layout.selectTab("Packages");

    const table = await Table.build(
      page,
      DetailsPage_SBOM.packagesTab.tableAriaLabel
    );
    const columnNameSelector = table._table.locator(`td[data-label="Name"]`);

    const namesAsc = await columnNameSelector.allInnerTexts();
    expect(isSorted(namesAsc, true)).toBe(true);

    // Reverse sorting
    await table.clickSortBy("Name");
    const namesDesc = await columnNameSelector.allInnerTexts();

    expect(isSorted(namesDesc, false)).toBe(true);
  });
});
