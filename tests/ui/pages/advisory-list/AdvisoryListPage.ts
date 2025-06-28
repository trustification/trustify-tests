import { expect, Page } from "@playwright/test";

export class AdvisoryListPage {
  private _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toBeVisible();
    return new AdvisoryListPage(page);
  }


}
