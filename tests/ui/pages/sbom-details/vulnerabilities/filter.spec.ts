// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

test.describe("Filter validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // Currently tab has no filters
  test.skip("Filters", async ({ page }) => {
    const vulnerabilityTab = await VulnerabilitiesTab.build(
      page,
      "quarkus-bom"
    );

    const toolbar = await vulnerabilityTab.getToolbar();
    const table = await vulnerabilityTab.getTable();

    // Full search
    await toolbar.applyTextFilter("Filter text", "CVE-2023-4853");
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Id", "CVE-2023-4853");

    // Labels filter
    await toolbar.applyMultiSelectFilter("Severity", ["High"]);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Id", "CVE-2023-4853");
  });
});
