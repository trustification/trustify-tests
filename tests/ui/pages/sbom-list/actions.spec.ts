// @ts-check

import { expect, test } from "@playwright/test";

import { login } from "../../helpers/Auth";
import { SBOMListPage } from "../Constants";
import { Navigation } from "../Navigation";
import { Table } from "../Table";

test.describe("Action validations", { tag: "@tier1" }, () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("SBOMs");
  });

  test("Actions - Download SBOM", async ({ page }) => {
    const table = await Table.build(page, SBOMListPage.tableAriaLabel);

    const sbomNames = await table._table
      .locator(`td[data-label="Name"]`)
      .allInnerTexts();

    const downloadPromise = page.waitForEvent("download");
    await table.clickAction("Download SBOM", 0);
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toEqual(`${sbomNames[0]}.json`);
  });

  test("Actions - Download License Report", async ({ page }) => {
    const table = await Table.build(page, SBOMListPage.tableAriaLabel);

    const sbomNames = await table._table
      .locator(`td[data-label="Name"]`)
      .allInnerTexts();

    const downloadPromise = page.waitForEvent("download");
    await table.clickAction("Download License Report", 0);
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toContain(sbomNames[0]);
  });

  test("Actions - Edit Labels", async ({ page }) => {
    const labels = ["color=red", "production"];

    const table = await Table.build(page, SBOMListPage.tableAriaLabel);
    await table.clickAction("Edit labels", 0);

    // Verify Modal is open
    const dialog = page.getByRole("dialog");
    expect(dialog).toBeVisible();

    const saveLabels = async () => {
      await dialog.locator("button[aria-label='submit']").click();
      await expect(dialog).not.toBeVisible();
    };

    // Add labels
    const inputText = dialog.getByPlaceholder("Add label");

    for (const label of labels) {
      await inputText.click();
      await inputText.fill(label);
      await inputText.press("Enter");
    }

    await saveLabels();

    // Verify labels were added
    await table.waitUntilDataIsLoaded();
    for (const label of labels) {
      await expect(
        table._table
          .locator(`td[data-label="Labels"]`)
          .first()
          .locator(".pf-v6-c-label", { hasText: label })
      ).toHaveCount(1);
    }

    // Clean labels added previously
    await table.clickAction("Edit labels", 0);

    for (const label of labels) {
      await dialog
        .locator(".pf-v6-c-label-group__list-item", {
          hasText: label,
        })
        .locator("button")
        .click();
    }

    await saveLabels();
    await table.waitUntilDataIsLoaded();

    for (const label of labels) {
      await expect(
        table._table
          .locator(`td[data-label="Labels"]`)
          .first()
          .locator(".pf-v6-c-label", { hasText: label })
      ).toHaveCount(0);
    }
  });
});
