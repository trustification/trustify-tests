import { expect, Page } from "@playwright/test";
import { DetailsPage } from "./DetailsPage";

export class SearchPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to given menu option and filters data
   * @param menu Option from Vertical navigation menu
   * @param data Search data to filter
   */
  async dedicatedSearch(menu: string, data: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: menu }).click();
    const detailsPage = new DetailsPage(this.page);
    await detailsPage.waitForData();
    await detailsPage.verifyDataAvailable();
    await this.page.getByPlaceholder("Search").click();
    await this.page.getByPlaceholder("Search").fill(data);
    await this.page.getByPlaceholder("Search").press("Enter");
    await detailsPage.verifyDataAvailable();
  }
}
