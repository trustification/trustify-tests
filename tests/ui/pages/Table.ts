import { expect, Locator, Page } from "@playwright/test";

type SortAria = "ascending" | "descending";

const getSortFromAria = (value: SortAria): boolean => {
  return value === "ascending" ? true : false;
};

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

    const result = new Table(page, table);
    await result.waitUntilDataIsLoaded();
    return result;
  }

  async waitUntilDataIsLoaded() {
    const rows = this._table.locator(
      'xpath=//tbody[not(@aria-label="Table loading")]'
    );
    await expect(rows.first()).toBeVisible();

    const rowsCount = await rows.count();
    expect(rowsCount).toBeGreaterThanOrEqual(1);
  }

  async clickSortBy(columnName: string) {
    const column = this._table.getByRole("columnheader", { name: columnName });

    await expect(column).toHaveAttribute("aria-sort");
    const currentSort = (await column.getAttribute("aria-sort")) as SortAria;

    // Apply sort
    await this._table.getByRole("button", { name: columnName }).click();
    await this.verifyTableIsSortedBy(columnName, !getSortFromAria(currentSort));

    await this.waitUntilDataIsLoaded();
  }

  async clickAction(actionName: string, rowIndex: number) {
    await this._table
      .locator(`button[aria-label="Kebab toggle"]`)
      .nth(rowIndex)
      .click();

    await this._page.getByRole("menuitem", { name: actionName }).click();
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

  async verifyTableHasNoData() {
    await expect(
      this._table.locator(`tbody[aria-label="Table empty"]`)
    ).toBeVisible();
  }

  async validateNumberOfRows(
    expectedRows: {
      equal?: number;
      greaterThan?: number;
      lessThan?: number;
    },
    columnName: string
  ) {
    const rows = this._table.locator(`td[data-label="${columnName}"]`);

    if (expectedRows.equal) {
      expect(await rows.count()).toBe(expectedRows.equal);
    }
    if (expectedRows.greaterThan) {
      expect(await rows.count()).toBeGreaterThan(expectedRows.greaterThan);
    }
    if (expectedRows.lessThan) {
      expect(await rows.count()).toBeLessThan(expectedRows.lessThan);
    }
  }
}
