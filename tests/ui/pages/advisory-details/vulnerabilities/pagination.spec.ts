// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";

// Number of items in table are below single page to be able to test
// Inf a Vulnerability that contains significant number of impacted SBOMs
test.describe.skip("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "CVE-2024-26308"
    );
    const pagination = await vulnerabilitiesTab.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const vulnerabilitiesTab = await VulnerabilitiesTab.build(
      page,
      "CVE-2024-26308"
    );

    const pagination = await vulnerabilitiesTab.getPagination();
    const table = await vulnerabilitiesTab.getTable();

    await pagination.validateItemsPerPage("ID", table);
  });
});
