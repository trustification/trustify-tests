import { expect, Locator, Page } from "@playwright/test";

export class Table {
  private _page: Page;
  _table: Locator;

  private constructor(page: Page, table: Locator) {
    this._page = page;
    this._table = table;
  }

  /**
   * @param page
   * @param tableAriaLabel the unique aria-label that correspont to the DOM element that contains the Table. E.g. <table aria-label="identifier"></table>
   * @returns a new instance of a Toolbar
   */
  static async build(page: Page, tableAriaLabel: string) {
    const table = page.locator(`table[aria-label="${tableAriaLabel}"]`);
    await expect(table).toBeVisible();
    return new Table(page, table);
  }

  async verifyTableIsSortedBy(columnName: string, asc: boolean = true) {
    await expect(
      this._table.getByRole("columnheader", { name: columnName })
    ).toHaveAttribute("aria-sort", asc ? "ascending" : "descending");
  }

  async verifyColumnContainsText(columnName: string, expectedValue: string) {
    await expect(
      this._table.locator(`td[data-label="${columnName}"]`, {
        hasText: expectedValue,
      })
    ).toBeVisible();
  }

  async verifyTableHasData() {
    const rows = this._table.locator(
      'xpath=//tbody[not(@aria-label="Table loading") and not(@aria-label="Table error") and not(@aria-label="Table empty")]'
    );

    // Wait for at least one to appear (or a specific one)
    await expect(rows.first()).toBeVisible();

    // Now safely count
    const rowsCount = await rows.count();
    expect(rowsCount).toBeGreaterThanOrEqual(1);
  }

  async verifyTableHasNoData() {
    await expect(
      this._table.locator(`tbody[aria-label="Table empty"]`)
    ).toBeVisible();
  }
}
