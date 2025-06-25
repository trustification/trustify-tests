import { Page } from "playwright-core";

export class Navigation {
  page: Page;

  private constructor(page: Page) {
    this.page = page;
  }

  static async build(page: Page) {
    return new Navigation(page);
  }

  async goToSidebar(
    menu:
      | "Dashboard"
      | "Search"
      | "SBOMs"
      | "Vulnerabilities"
      | "Packages"
      | "Advisories"
      | "Importers"
      | "Upload"
  ) {
    await this.page.goto("/upload");
    await this.page.getByRole("link", { name: menu }).click();
  }
}
