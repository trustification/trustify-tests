import { expect, Page } from "@playwright/test";
import { DetailsPage } from "./DetailsPage";

export class SearchPage {
  page: Page;
  menu: String;

  constructor(page: Page, menu: String) {
    this.page = page;
    this.menu = menu;
  }

  /**
   * Searches for an item from the Search view
   * @param type Type of item to search for, corresponds with the tabs in the Search view (SBOMs, Packages, Vulnerabilities, Advisories)
   * @param data Search data to filter
   */
  async generalSearch(type: string, data: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Search" }).click();
    const detailsPage = new DetailsPage(this.page);
    await detailsPage.waitForData();
    await detailsPage.verifyDataAvailable();
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability"
      )
      .click();
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability"
      )
      .fill(data);
    await this.page
      .getByPlaceholder(
        "Search for an SBOM, Package, Advisory, or Vulnerability"
      )
      .press("Enter");
    await detailsPage.selectTab(type);
  }

  /**
   * Navigates to given menu option and filters data
   * @param menu Option from Vertical navigation menu
   * @param data Search data to filter
   */
  async dedicatedSearch(data: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: `${this.menu}` }).click();
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
    await this.page.locator("#autocomplete-search").locator('[aria-label="Search input"]').fill(searchText);
  }

  async autoFillIsVisible() {
    await expect(this.page.locator("#autocomplete-search").locator(".pf-v5-c-menu")).toBeVisible();
  }

  async autoFillIsNotVisible() {
    await expect(this.page.locator("#autocomplete-search").locator(".pf-v5-c-menu")).not.toBeVisible();
  }
}
