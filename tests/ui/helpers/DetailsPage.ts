import { expect, Page } from "@playwright/test";

export class DetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectTab(tabName: string) {
    const tab = this.page.locator("button[role='tab']", { hasText: tabName });
    expect(tab).toBeVisible();
    tab.click();
  }

  async verifyPageHeader(header: string) {
    await expect(this.page.getByRole("heading")).toContainText(header);
  }

  async verifyTabIsSelected(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  }

  async verifyTabIsVisible(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toBeVisible();
  }

  async verifyTabIsNotVisible(tabName: string) {
    await expect(this.page.getByRole("tab", { name: tabName })).toHaveCount(0);
  }
}
