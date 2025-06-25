import { expect, Page } from "@playwright/test";

/**
 * Describes the Details of an Entity. E.g. SBOM Details Page.
 * Generally based on https://www.patternfly.org/extensions/component-groups/details-page/
 */
export class SbomDetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Verifies the Vulnerability counts from summary to table
  async verifyVulnerabilityPanelcount() {
    const pieVulnSevLabel = `xpath=//*[name()='svg']/*[name()='g']//*[name()='tspan']`;
    const totalVuln = `xpath=//*[name()='svg']/*[name()='text']//*[name()='tspan'][1]`;
    const totalVulnElement = this.page.locator(totalVuln);
    await totalVulnElement.waitFor({ state: "visible", timeout: 5000 });
    const totalVulnPanel = await totalVulnElement.textContent();
    const panelVulnSev = await this.getCountFromLabels(pieVulnSevLabel, ":");
    const sumPanelVulnSev = await Object.values(panelVulnSev).reduce(
      (sum, value) => sum + value,
      0
    );
    const tableVulnSev = await this.getCVSSCountFromVulnTable();
    let mismatch = false;
    await expect(
      parseInt(totalVulnPanel!, 10),
      `Total Vulnerabilities count ${totalVulnPanel} mismatches with sum of individual ${sumPanelVulnSev}`
    ).toEqual(sumPanelVulnSev);

    for (const severity in tableVulnSev) {
      if (panelVulnSev[severity] !== undefined) {
        if (panelVulnSev[severity] !== tableVulnSev[severity]) {
          console.log(
            `${severity} count mismatch. Summary panel count ${panelVulnSev[severity]}, Rows count ${tableVulnSev[severity]}`
          );
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
    let elements = await this.page.locator(labelLocator).all();
    let vulnLabelCount = {};
    for (let element of elements) {
      let innerText = await element.textContent();
      let labelArr = innerText!.split(delimiter);
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
    let nextPage = true;
    const counts = {
      Unknown: 0,
      None: 0,
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    const nextButton = this.page.locator(
      `xpath=(//section[@id='refVulnerabilitiesSection']//button[@data-action='next'])[1]`
    );

    const noOfRows = this.page.locator(
      `xpath=//section[@id="refVulnerabilitiesSection"]//button[@id="pagination-id-top-toggle"]`
    );
    if (await noOfRows.isEnabled()) {
      await noOfRows.click();
      await this.page.getByRole("menuitem", { name: "100 per page" }).click();
    }

    while (nextPage) {
      for (let cvssType in counts) {
        let cvssLocator = await this.page
          .locator(`xpath=//td[@data-label='CVSS']//div[.='${cvssType}']`)
          .all();
        counts[cvssType] += cvssLocator.length;
      }
      nextPage = await nextButton.isEnabled();
      if (nextPage) {
        await nextButton.click();
      }
    }
    return counts;
  }
}
