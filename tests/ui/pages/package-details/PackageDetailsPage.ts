import { expect, Page } from "@playwright/test";
import { DetailsPageLayout } from "../DetailsPageLayout";
import { Navigation } from "../Navigation";
import { VulnerabilityListPage } from "../vulnerability-list/VulnerabilityListPage";
import { PackageListPage } from "../package-list/PackageListPage";

export class PackageDetailsPage {
  private readonly _page: Page;
  _layout: DetailsPageLayout;

  private constructor(page: Page, layout: DetailsPageLayout) {
    this._page = page;
    this._layout = layout;
  }

  static async build(page: Page, packageName: string) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Packages");

    const listPage = await PackageListPage.build(page);
    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    await toolbar.applyTextFilter("Filter text", packageName);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", packageName);

    await page.getByRole("link", { name: packageName, exact: true }).click();

    const layout = await DetailsPageLayout.build(page);
    await expect(
      page.getByRole("heading", { name: packageName })
    ).toBeVisible();

    return new PackageDetailsPage(page, layout);
  }
}
