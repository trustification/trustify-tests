// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { AdvisoryListPage } from "../Constants";
import { Navigation } from "../Navigation";
import { Pagination } from "../Pagination";
import { Table } from "../Table";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Advisories");
  });

  test("Navigation button validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      AdvisoryListPage.paginationIdTop
    );
    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      AdvisoryListPage.paginationIdTop
    );

    const table = await Table.build(page, AdvisoryListPage.tableAriaLabel);
    await pagination.validateItemsPerPage("ID", table);
  });
});
