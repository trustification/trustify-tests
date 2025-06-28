import { expect, Page } from "@playwright/test";
import { ListPage_SBOM } from "../Constants";
import { DetailsPageLayout } from "../DetailsPageLayout";
import { Navigation } from "../Navigation";
import { Table } from "../Table";
import { Toolbar } from "../Toolbar";

export class SbomDetailsPage {
  private _page: Page;
  _layout: DetailsPageLayout;

  private constructor(page: Page, layout: DetailsPageLayout) {
    this._page = page;
    this._layout = layout;
  }

  static async build(page: Page, sbomName: string) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");

    const toolbar = await Toolbar.build(page, ListPage_SBOM.toolbarAriaLabel);
    const table = await Table.build(page, ListPage_SBOM.tableAriaLabel);

    await toolbar.applyTextFilter(ListPage_SBOM.filters.filterText, sbomName);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("Name", sbomName);

    await page.getByRole("link", { name: "quarkus-bom", exact: true }).click();

    const layout = await DetailsPageLayout.build(page);
    await expect(page.getByRole("heading", { name: sbomName })).toBeVisible();

    return new SbomDetailsPage(page, layout);
  }
}
