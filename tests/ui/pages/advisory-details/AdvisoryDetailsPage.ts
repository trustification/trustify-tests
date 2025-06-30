import { expect, Page } from "@playwright/test";
import { DetailsPageLayout } from "../DetailsPageLayout";
import { Navigation } from "../Navigation";
import { AdvisoryListPage } from "../advisory-list/AdvisoryListPage";

export class AdvisoryDetailsPage {
  private readonly _page: Page;
  _layout: DetailsPageLayout;

  private constructor(page: Page, layout: DetailsPageLayout) {
    this._page = page;
    this._layout = layout;
  }

  static async build(page: Page, advisoryID: string) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Advisories");

    const listPage = await AdvisoryListPage.build(page);
    const toolbar = await listPage.getToolbar();
    const table = await listPage.getTable();

    await toolbar.applyTextFilter("Filter text", advisoryID);
    await table.waitUntilDataIsLoaded();
    await table.verifyColumnContainsText("ID", advisoryID);

    await page.getByRole("link", { name: advisoryID, exact: true }).click();

    const layout = await DetailsPageLayout.build(page);
    await layout.verifyPageHeader(advisoryID);

    return new AdvisoryDetailsPage(page, layout);
  }
}
