// @ts-check

import { test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { PackageListPage } from "../Constants";
import { Navigation } from "../Navigation";
import { Pagination } from "../Pagination";
import { Table } from "../Table";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");
  });

  test("Navigation button validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      PackageListPage.paginationIdTop
    );
    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const pagination = await Pagination.build(
      page,
      PackageListPage.paginationIdTop
    );

    const table = await Table.build(page, PackageListPage.tableAriaLabel);
    await pagination.validateItemsPerPage("Name", table);
  });
});
