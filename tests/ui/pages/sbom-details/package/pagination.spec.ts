// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { PackageTab } from "./PackageTab";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Navigation button validations", async ({ page }) => {
    const packageTab = await PackageTab.build(page, "quarkus-bom");
    const pagination = await packageTab.getPagination();

    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const packageTab = await PackageTab.build(page, "quarkus-bom");

    const pagination = await packageTab.getPagination();
    const table = await packageTab.getTable();

    await pagination.validateItemsPerPage("Name", table);
  });
});
