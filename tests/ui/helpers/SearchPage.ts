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

  async clickOnPageAction(actionName: string) {
    await this.page.getByRole("button", { name: "Actions" }).click();
    await this.page.getByRole("menuitem", { name: actionName }).click();
  }

  async verifyPageHeader(header: string) {
    await expect(this.page.getByRole("heading")).toContainText(header);
  }

  async open() {
    await this.page.goto("/search");
  } 

  async typeInSearchBox(searchText: string) {
    await this.page.waitForLoadState("networkidle");
    const searchBox = this.page.locator("#autocomplete-search").locator('[aria-label="Search input"]');
    await expect(searchBox).toBeVisible();
    await searchBox.click();
    await this.page.keyboard.type(searchText);
  }

  async autoFillIsVisible() {
    await expect(this.page.locator("#autocomplete-search").locator(".pf-v5-c-menu")).toBeVisible();
  }

  async autoFillIsNotVisible() {
    await expect(this.page.locator("#autocomplete-search").locator(".pf-v5-c-menu")).toBeHidden({timeout: 30000});
  }
}
