// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { Navigation } from "../Navigation";
import { SBOMListPage } from "../Constants";
import { Table } from "../Table";
import { Pagination } from "../Pagination";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Navigation button validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      SBOMListPage.paginationIdTop
    );
    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      SBOMListPage.paginationIdTop
    );

    const table = await Table.build(page, SBOMListPage.tableAriaLabel);
    await pagination.validateItemsPerPage("Name", table);
  });
});
