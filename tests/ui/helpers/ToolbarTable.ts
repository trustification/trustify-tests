import { expect, Page } from "@playwright/test";

export class ToolbarTable {
  private _page: Page;
  private _tableName: string;

  constructor(page: Page, tableName: string) {
    this._page = page;
    this._tableName = tableName;
  }

  async verifyPaginationHasTotalResults(totalResults: number) {
    const paginationTop = this._page.locator("#pagination-id-top-toggle");
    await expect(paginationTop.locator("b").nth(1)).toHaveText(
      `${totalResults}`
    );
  }

  async verifyPaginationHasTotalResultsGreatherThan(
    totalResults: number,
    include: boolean = false
  ) {
    const paginationTop = this._page.locator("#pagination-id-top-toggle");
    const totalResultsText = await paginationTop
      .locator("b")
      .nth(1)
      .textContent();
    if (include) {
      expect(Number(totalResultsText)).toBeGreaterThanOrEqual(totalResults);
    } else {
      expect(Number(totalResultsText)).toBeGreaterThan(totalResults);
    }
  }

  async filterByText(filterText: string) {
    const input = this._page.locator("#search-input");
    await input.fill(filterText);
    await input.press("Enter");
  }

  async verifyTableIsSortedBy(columnName: string, asc: boolean = true) {
    const table = this.getTable();
    await expect(
      table.getByRole("columnheader", { name: columnName })
    ).toHaveAttribute("aria-sort", asc ? "ascending" : "descending");
  }

  async verifyColumnContainsText(columnName: any, expectedValue: any) {
    const table = this.getTable();
    await expect(table.locator(`td[data-label="${columnName}"]`)).toContainText(
      expectedValue
    );
  }

  private getTable() {
    return this._page.locator(`table[aria-label="${this._tableName}"]`);
  }
}
