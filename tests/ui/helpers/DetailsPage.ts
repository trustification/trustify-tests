import { expect, Page } from "@playwright/test";

/**
 * Describes the Details of an Entity. E.g. SBOM Details Page.
 * Generally based on https://www.patternfly.org/extensions/component-groups/details-page/
 */
export class DetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectTab(tabName: string) {
    const tab = this.page.locator("button[role='tab']", { hasText: tabName });
    await expect(tab).toBeVisible();
    await tab.click();
  }

  async clickOnPageAction(actionName: string) {
    await this.page.getByRole("button", { name: "Actions" }).click();
    await this.page.getByRole("menuitem", { name: actionName }).click();
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

  //Wait for Loading Spinner to detach from the DOM
  async waitForData() {
    const spinner = this.page.locator(`xpath=//table`);
    await spinner.waitFor({ state: "visible", timeout: 50000 });
  }

  //Verifies the Page loads with data
  async verifyDataAvailable() {
    await expect(
      this.page.locator(
        `xpath=//div[(.='No data available to be shown here.')]`
      )
    ).toHaveCount(0);
  }

  //Verifies the Vulnerability counts from summary to table
  async verifyVulnerabilityPanelcount() {
    const pieVulnSevLabel = `xpath=//*[name()='svg']/*[name()='g']//*[name()='tspan']`;
    const totalVuln = `xpath=//*[name()='svg']/*[name()='text']//*[name()='tspan'][1]`;

    const panelVulnSev = await this.getCountFromLabels(pieVulnSevLabel, ":");
    const sumPanelVulnSev = await Object.values(panelVulnSev).reduce(
      (sum, value) => sum + value,
      0
    );
    const totalVulnPanel = await this.page.locator(totalVuln).textContent();
    const tableVulnSev = await this.getCVSSCountFromVulnTable();
    var mismatch = false;
    await expect(
      parseInt(totalVulnPanel!, 10),
      `Total Vulnerabilities count ${totalVulnPanel} mismatches with sum of individual ${sumPanelVulnSev}`
    ).toEqual(sumPanelVulnSev);

    for (const severity in tableVulnSev) {
      if (panelVulnSev[severity] !== undefined) {
        if (panelVulnSev[severity] !== tableVulnSev[severity]) {
          console.log("{severity} count mismatch");
          mismatch = true;
        }
      }
    }
    await expect(mismatch, "Panel count mismatches to table count").not.toBe(
      true
    );
  }

  /**
   * Get all the Elements matching to the @param labelLocator and retrieves the textContext of each element
   * Splits the text with @param delimiter
   * @returns the mutable object { [key: 0th_element ]: 1st_element }
   */
  async getCountFromLabels(
    labelLocator: string,
    delimiter: string
  ): Promise<{ [key: string]: number }> {
    const elements = await this.page.locator(labelLocator).all();
    const vulnLabelCount = {};
    for (const element of elements) {
      const innerText = await element.textContent();
      const labelArr = await innerText!.split(delimiter);
      vulnLabelCount[labelArr[0].trim().toString()] = parseInt(
        labelArr[1].trim(),
        10
      );
    }
    return vulnLabelCount;
  }

  /**
   * Retrieves the CVSS value from each row of Vulnerability table
   * @returns Count of each CVSS type in { [key: severity ]: count }
   */

  async getCVSSCountFromVulnTable(): Promise<{ [key: string]: number }> {
    var nextPage = true;
    const counts = {
      Unknown: 0,
      None: 0,
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    const nextButton = await this.page.locator(
      `xpath=(//section[@id='refVulnerabilitiesSection']//button[@data-action='next'])[1]`
    );

    const noOfRows = await this.page.locator(
      `xpath=//section[@id="refVulnerabilitiesSection"]//button[@id="pagination-id-top-toggle"]`
    );
    if (await noOfRows.isEnabled()) {
      noOfRows.click();
      await this.page.getByRole("menuitem", { name: "100 per page" }).click();
    }

    while (nextPage) {
      const cvssLocator = await this.page
        .locator(
          `xpath=//table[@aria-label='Vulnerability table']//td[@data-label='CVSS']`
        )
        .all();
      for (const cvss of cvssLocator) {
        const severity = await cvss.innerText();
        counts[severity] = counts[severity] ? counts[severity] + 1 : 1;
      }
      nextPage = await nextButton.isEnabled();
      if (nextPage) {
        await nextButton.click();
      }
    }
    return counts;
  }
}
