// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { DetailsPage_SBOM } from "../../Constants";
import { Table } from "../../Table";
import { Toolbar } from "../../Toolbar";
import { SbomDetailsPage } from "../SbomDetailsPage";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");
    await detailsPage._layout.selectTab("Packages");

    const toolbar = await Toolbar.build(
      page,
      DetailsPage_SBOM.packagesTab.toolbarAriaLabel
    );
    const table = await Table.build(
      page,
      DetailsPage_SBOM.packagesTab.tableAriaLabel
    );

    // Full search
    await toolbar.applyTextFilter(
      DetailsPage_SBOM.packagesTab.filters.filterText,
      "commons-compress"
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");

    // Labels filter
    await toolbar.applyMultiSelectFilter(
      DetailsPage_SBOM.packagesTab.filters.license,
      ["Apache-2.0", "NOASSERTION"]
    );
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");
  });
});
