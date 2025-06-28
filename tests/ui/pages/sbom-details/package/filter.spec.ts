// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { PackageTab } from "./PackageTab";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Filters", async ({ page }) => {
    const packageTab = await PackageTab.build(page, "quarkus-bom");

    const toolbar = await packageTab.getToolbar();
    const table = await packageTab.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "commons-compress");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");

    // Labels filter
    await toolbar.applyMultiSelectFilter("License", [
      "Apache-2.0",
      "NOASSERTION",
    ]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", "commons-compress");
  });
});
