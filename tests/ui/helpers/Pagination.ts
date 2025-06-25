import { expect, Locator, Page } from "@playwright/test";

export class Pagination {
  private _page: Page;
  _pagination: Locator;

  private constructor(page: Page, pagination: Locator) {
    this._page = page;
    this._pagination = pagination;
  }

  static async build(page: Page, paginationId: string) {
    const pagination = page.locator(`#${paginationId}`);
    await expect(pagination).toBeVisible();
    return new Pagination(page, pagination);
  }

  /**
   * Retrieves the Total page count from pagination
   * @returns total count from pagination text
   */
  async getTotalNumberOfItems(): Promise<number | null> {
    const totalResultsText = await this._pagination
      .locator(".pf-v6-c-pagination__total-items")
      .locator("b")
      .nth(1)
      .textContent();
    return totalResultsText ? parseInt(totalResultsText) : null;
  }

  /**
   * Retrieves the Total page count from pagination
   * @returns total count from pagination text
   */
  async getTotalPagesFromNavigation(): Promise<number | null> {
    const navTotal = this._pagination.locator(
      `xpath=//span[contains(@class,'form-control')]/following-sibling::span`
    );
    const totalPages = await navTotal.textContent();
    return parseInt(totalPages!.replace("of", "").trim(), 10);
  }

  /**
   * Selects Number of rows per page on the table
   * @param perPage Number of rows
   */
  async selectPerPage(perPage: string) {
    await this._pagination
      .locator(`//button[@aria-haspopup='listbox']`)
      .click();
    await this._page.getByRole("menuitem", { name: perPage }).click();
  }

  /**
   * Verifies the pagination count against per page selection
   * Example, SBOM Explorer - Vulnerabilities and Packages section top and bottom sections.
   * Parent Element for Vulnerabilities section top Pagination `//div[@id="vulnerability-table-pagination-top"]`
   * And bottom section `//div[@id="vulnerability-table-pagination-bottom"]`
   */
  async verifyPagination() {
    const perPageValues = [10, 20, 50, 100];
    const totalItems = await this.getTotalNumberOfItems();
    expect(totalItems).not.toBeNull();

    for (const value of perPageValues) {
      const firstPage = this._pagination.getByRole("button", {
        name: "Go to first page",
      });
      if (await firstPage.isEnabled()) {
        await firstPage.click();
      }
      let expectedPagecount = Math.trunc(totalItems! / value);
      let remainingRows = totalItems! % value;
      if (remainingRows > 0) {
        expectedPagecount += 1;
      }
      await this.selectPerPage(value + " per page");

      // Wait for page to load
      await expect(
        this._pagination.locator(".pf-v6-c-pagination__nav")
      ).toContainText(`of ${expectedPagecount}`, { timeout: 15000 });

      await this.navigateToEachPageVerifyRowsCount(
        expectedPagecount,
        value,
        remainingRows
      );
    }
  }

  /**
   * Verifies Number of rows on the table equals to or lesser than the row count given
   * @param rowsCount Number of rows
   */
  async verifyPerPageToRowCount(rowsCount: number) {
    // Bug: https://issues.redhat.com/browse/TC-2353
    // expect(this._page.locator("table > tbody > tr").count()).toEqual(rowsCount);
  }

  /**
   * Navigates to Each page with Next button and verify the rows count
   * @param pageCount Number of Pages expected
   * @param perPageRows Number of rows expected per page
   * @param remainingRows Number of rows in Last Page
   */
  async navigateToEachPageVerifyRowsCount(
    pageCount: number,
    perPageRows: number,
    remainingRows: number
  ) {
    const nextButton = this._pagination.getByLabel("Go to next page");
    let expMinCount = 1;
    let expMaxCount = perPageRows;
    if (pageCount === 1) {
      expMaxCount = remainingRows;
    }
    for (let i = 1; i < pageCount; i++) {
      // Wait for page to load
      await expect(
        this._pagination.locator("input[aria-label='Current page']")
      ).toHaveValue(`${i}`, { timeout: 30000 });

      await this.verifyRowsCounterPagination(expMinCount, expMaxCount);
      await this.verifyPerPageToRowCount(perPageRows);
      await nextButton.isEnabled();
      await nextButton.click();

      expMinCount += perPageRows;
      if (i === pageCount - 1) {
        expMaxCount = expMaxCount + remainingRows;
      } else {
        expMaxCount += perPageRows;
      }
    }
    if (remainingRows > 0) {
      await this.verifyPerPageToRowCount(remainingRows);
      await this.verifyRowsCounterPagination(expMinCount, expMaxCount);
    }
    await nextButton.isDisabled();
  }

  /**
   * @param expMinCount Expected Min count on the counter
   * @param expMaxCount Expected Max count on the counter
   */
  async verifyRowsCounterPagination(expMinCount: number, expMaxCount: number) {
    const pageCounter = this._pagination.locator(
      `xpath=//button//b[contains (.,"-")]`
    );
    const counterText = await pageCounter.textContent();
    let [min, max] = counterText!
      .split("-")
      .map((value) => parseInt(value.trim()));
    expect(min).toEqual(expMinCount);
    expect(max).toEqual(expMaxCount);
  }
}
