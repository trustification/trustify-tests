import { expect, Page } from "@playwright/test";
export class ToolbarTable {
  private readonly _page: Page;
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

  /**
   * Verifies the pagination count against per page selection
   * @param parentElem required to identify the pagination across sections
   * Example, SBOM Explorer - Vulnerabilities and Packages section top and bottom sections.
   * Parent Element for Vulnerabilities section top Pagination `//div[@id="vulnerability-table-pagination-top"]`
   * And bottom section `//div[@id="vulnerability-table-pagination-bottom"]`
   */
  async verifyPagination(parentElem: string) {
    const section = this._page.locator(parentElem);
    const perPageValues = [10, 20, 50, 100];
    const totalRows = await this.getTotalRowsFromPagination(parentElem);
    for (const value of perPageValues) {
      const firstPage = section.getByRole("button", {
        name: "Go to first page",
      });
      if (await firstPage.isEnabled()) {
        await firstPage.click();
      }
      let expectedPagecount = Math.trunc(totalRows / value);
      let remainingRows = totalRows % value;
      if (remainingRows > 0) {
        expectedPagecount += 1;
      }
      await this.selectPerPage(parentElem, value + " per page");
      const progressBar = this._page.getByRole("gridcell", {
        name: "Loading...",
      });
      await progressBar.waitFor({ state: "hidden", timeout: 5000 });
      const actualPageCount =
        await this.getTotalPagesFromNavigation(parentElem);
      await expect(actualPageCount, "Page count mismatches").toEqual(
        expectedPagecount
      );
      await this.navigateToEachPageVerifyRowsCount(
        parentElem,
        expectedPagecount,
        value,
        remainingRows
      );
    }
  }

  /**
   * Retrieves the Total page count from pagination
   * @param parentElem required to identify the pagination across sections
   * @returns total count from pagination text
   */
  async getTotalPagesFromNavigation(parentElem: string): Promise<number> {
    const section = this._page.locator(parentElem);
    const navTotal = await section.locator(
      `xpath=//span[contains(@class,'form-control')]/following-sibling::span`
    );
    const totalPages = await navTotal.textContent();
    return parseInt(totalPages!.replace("of", "").trim(), 10);
  }

  /**
   * Retrieves the Total Row count from pagination
   * @param parentElem required to differentiate top and bottom pagination
   * @returns total row count from pagination dropdown
   */
  async getTotalRowsFromPagination(parentElem: string): Promise<number> {
    const tableError = this._page.locator(
      `xpath=(//tbody[@aria-label="Table error"])[1]`
    );
    if (await tableError.isVisible()) {
      await expect(tableError, "No Data available").not.toBeVisible();
    }
    const progressBar = this._page.getByRole("gridcell", {
      name: "Loading...",
    });
    await progressBar.waitFor({ state: "hidden", timeout: 5000 });
    const pagination = this._page.locator(parentElem);
    const totalResultsText = await pagination
      .locator(`xpath=//button//b[not(contains (.,'-'))]`)
      .textContent();
    return parseInt(totalResultsText!.trim(), 10);
  }

  /**
   * Selects Number of rows per page on the table
   * @param perPage Number of rows
   */
  async selectPerPage(parentElem: string, perPage: string) {
    const pagination = this._page.locator(parentElem);
    await pagination.locator(`//button[@aria-haspopup='listbox']`).click();
    await this._page.getByRole("menuitem", { name: perPage }).click();
  }

  /**
   * Verifies Number of rows on the table equals to or lesser than the row count given
   * @param rowsCount Number of rows
   */
  async verifyPerPageToRowCount(rowsCount: number) {
    const table = this.getTable();
    const rows = await table.locator(`xpath=//tbody/tr`);
    const tabRows = await rows.count();
    // Bug: https://issues.redhat.com/browse/TC-2353
    await expect(tabRows).toEqual(rowsCount);
  }

  /**
   * Navigates to Each page with Next button and verify the rows count
   * @param parentElem required to identify the pagination across sections
   * @param pageCount Number of Pages expected
   * @param perPageRows Number of rows expected per page
   * @param remainingRows Number of rows in Last Page
   */
  async navigateToEachPageVerifyRowsCount(
    parentElem: string,
    pageCount: number,
    perPageRows: number,
    remainingRows: number
  ) {
    const section = this._page.locator(parentElem);
    const nextButton = await section.getByLabel("Go to next page");
    let expMinCount = 1;
    let expMaxCount = perPageRows;
    if (pageCount === 1) {
      expMaxCount = remainingRows;
    }
    for (let i = 1; i < pageCount; i++) {
      await this.verifyRowsCounterPagination(
        parentElem,
        expMinCount,
        expMaxCount
      );
      await this.verifyPerPageToRowCount(perPageRows);
      await nextButton.isEnabled();
      await nextButton.click();
      const progressBar = this._page.getByRole("gridcell", {
        name: "Loading...",
      });
      await progressBar.waitFor({ state: "hidden", timeout: 5000 });
      expMinCount += perPageRows;
      if (i === pageCount - 1) {
        expMaxCount = expMaxCount + remainingRows;
      } else {
        expMaxCount += perPageRows;
      }
    }
    if (remainingRows > 0) {
      await this.verifyPerPageToRowCount(remainingRows);
      await this.verifyRowsCounterPagination(
        parentElem,
        expMinCount,
        expMaxCount
      );
    }
    await nextButton.isDisabled();
  }

  /**
   *
   * @param parentElem required to differentiate top and bottom pagination
   * @param expMinCount Expected Min count on the counter
   * @param expMaxCount Expected Max count on the counter
   */
  async verifyRowsCounterPagination(
    parentElem: string,
    expMinCount: number,
    expMaxCount: number
  ) {
    const pagination = this._page.locator(parentElem);
    const pageCounter = await pagination.locator(
      `xpath=//button//b[contains (.,"-")]`
    );
    const counterText = await pageCounter.textContent();
    let [min, max] = counterText!
      .split("-")
      .map((value) => parseInt(value.trim()));
    await expect(min).toEqual(expMinCount);
    await expect(max).toEqual(expMaxCount);
  }

  private getTable() {
    return this._page.locator(`table[aria-label="${this._tableName}"]`);
  }
}
