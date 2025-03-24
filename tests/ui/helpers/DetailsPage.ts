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
    expect(tab).toBeVisible();
    tab.click();
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

  async waitForData() {
    await expect(this.page.getByLabel("Contents")).toHaveCount(0, {
      timeout: 5000,
    });
  }

  async verifyDataAvailable() {
    const rows = await this.page
      .locator("xpath=//div[(.='No data available to be shown here.')]")
      .count();
    await expect(rows, "No data available - Verify the data load").toEqual(0);
  }

  async verifyVulnerabilityPanelcount() {
    const pieVulnSevLabel =
      "xpath=//*[name()='svg']/*[name()='g']//*[name()='tspan']";
    const totalVuln =
      "xpath=//*[name()='svg']/*[name()='text']//*[name()='tspan'][1]";

    const panelVulnSev = await this.getCountFromLabels(pieVulnSevLabel, ":");
    const sumPanelVulnSev = Object.values(panelVulnSev).reduce(
      (sum, value) => sum + value,
      0
    );
    const totalVulnPanel = await this.page.locator(totalVuln).innerText();
    const tableVulnSev = await this.getCVSSCountFromVulnTable();
    var mismatch = false;

    await expect(
      parseInt(totalVulnPanel, 10),
      "Total Vulnerabilities count {totalVuln} mismatches with sum of individual {sumOfVulnSev}"
    ).toEqual(sumPanelVulnSev);

    for (const severity in tableVulnSev) {
      if (panelVulnSev[severity] !== undefined) {
        if (panelVulnSev[severity] !== tableVulnSev[severity]) {
          console.log("{severity} count mismatch");
          mismatch = true;
        }
      }
    }
    await expect(mismatch, "Panel count mismatches to table count");
  }

  async getCountFromLabels(
    labelLocator: string,
    delimiter: string
  ): Promise<{ [key: string]: number }> {
    const elements = await this.page.locator(labelLocator).all();
    const vulnLabelCount = {};
    for (const element of elements) {
      const innerText = await element.innerText();
      const labelArr = await innerText?.split(delimiter);
      vulnLabelCount[labelArr[0].trim().toString()] = parseInt(
        labelArr[1].trim(),
        10
      );
    }
    return vulnLabelCount;
  }

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
      "xpath=(//section[@id='refVulnerabilitiesSection']//button[@data-action='next'])[1]"
    );

    await this.page
      .getByLabel("Vulnerabilities within the")
      .locator("#pagination-id-top-toggle")
      .click();
    await this.page.getByRole("menuitem", { name: "100 per page" }).click();

    while (nextPage) {
      const cvssLocator = await this.page
        .locator(
          "xpath=//table[@aria-label='Vulnerability table']//td[@data-label='CVSS']"
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
