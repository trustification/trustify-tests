// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { SbomsTab } from "./SbomsTab";

// Number of items in table are below single page to be able to test
// Inf a Vulnerability that contains significant number of impacted SBOMs
test.describe.skip("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const sbomTab = await SbomsTab.build(page, "keycloak-core");
    const pagination = await sbomTab.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const sbomTab = await SbomsTab.build(page, "keycloak-core");

    const pagination = await sbomTab.getPagination();
    const table = await sbomTab.getTable();

    await pagination.validateItemsPerPage("Name", table);
  });
});
