// @ts-check

import { test } from "@playwright/test";

import { login } from "../../../helpers/Auth";
import { DetailsPage_SBOM } from "../../Constants";
import { Navigation } from "../../Navigation";
import { Pagination } from "../../Pagination";
import { Table } from "../../Table";
import { SbomDetailsPage } from "../SbomDetailsPage";

test.describe("Pagination validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Navigation button validations", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");
    await detailsPage._layout.selectTab("Packages");

    const pagination = await Pagination.build(
      page,
      DetailsPage_SBOM.packagesTab.paginationIdTop
    );
    await pagination.validatePagination();
  });

  test("Items per page validations", async ({ page }) => {
    const detailsPage = await SbomDetailsPage.build(page, "quarkus-bom");
    await detailsPage._layout.selectTab("Packages");

    const pagination = await Pagination.build(
      page,
      DetailsPage_SBOM.packagesTab.paginationIdTop
    );

    const table = await Table.build(
      page,
      DetailsPage_SBOM.packagesTab.tableAriaLabel
    );
    await pagination.validateItemsPerPage("Name", table);
  });
});
