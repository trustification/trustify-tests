import fs from "fs";
import path from "path";
import { expect, test } from "@playwright/test";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then, Step } = createBdd();

const MENU_UPLOAD = "Upload";
const HEADER_UPLOAD = "Upload";
const BUTTON_UPLOAD = "Upload";
const TAB_SBOM = "SBOM";
const DRAG_INSTRUCTIONS = "Drag and drop files here or";
const ACCEPTED_TYPES_DESC = "Accepted file types:";

const TIMEOUT_PAGELOAD_IMPORT = 2_000;
const TIMEOUT_UPLOAD_DONE = 90_000;

const SBOM_SET = {
  "single SBOM": ["test-upload-001.spdx.json"],
  "multiple SBOMs": [
    "test-upload-002.spdx.json",
    "test-upload-003.spdx.json.bz2",
    "test-upload-004.cdx.json",
    "test-upload-005.cdx.json",
    "test-upload-006.cdx.json.bz2",
  ],
};

const visitUploadPage = async ({ page }) => {
  await page.goto("/importers"); // dont care which page here, importers is lot faster than Dashboard
  await page.getByRole("link", { name: MENU_UPLOAD }).click();

  const header = page.locator(`xpath=(//h1[text()="${HEADER_UPLOAD}"])`);
  await header.waitFor({ state: "visible", timeout: TIMEOUT_PAGELOAD_IMPORT });
};
Step("User visits Upload page", visitUploadPage);

function assetsPath(files: string[]): string[] {
  return files.map((e) => path.join(__dirname, "assets", e));
}

// PAGE CONTENT

Then("SBOM upload tab is selected", async ({ page }) => {
  await expect(page.getByRole("tab", { name: TAB_SBOM })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

Then("Drag and drop instructions are visible", async ({ page }) => {
  await expect(
    page.getByLabel("SBOM").getByText(DRAG_INSTRUCTIONS)
  ).toBeVisible();
});

Then("Upload button is present", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();
});

Then("Accepted file types are described", async ({ page }) => {
  expect(page.getByLabel("SBOM").getByText(ACCEPTED_TYPES_DESC)).toBeVisible();
});

// FILE UPLOAD

When("User uploads {string}", async ({ page }, data_set_key) => {
  const files = assetsPath(SBOM_SET[data_set_key]);

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: BUTTON_UPLOAD, exact: true }).click();
  const fileChooser = await fileChooserPromise;

  await fileChooser.setFiles(files);
});

// FILE UPLOAD RESULTS

Then(
  "Total uploaded count is shown for {string}",
  async ({ page }, data_set_key) => {
    test.setTimeout(TIMEOUT_UPLOAD_DONE);
    const count = SBOM_SET[data_set_key].length;

    await expect(
      page.locator(
        "#upload-sbom-tab-content .pf-v6-c-multiple-file-upload__status-progress"
      )
    ).toContainText(`${count} of ${count} files uploaded`, {
      timeout: TIMEOUT_UPLOAD_DONE,
    });
  }
);

Then(
  "Results of uploading {string} are visible",
  async ({ page }, data_set_key) => {
    const individual_results = page.locator(
      ".pf-v6-c-expandable-section__content .pf-v6-c-multiple-file-upload__status-item"
    );

    // expect correct count of individual result entries
    await expect(individual_results).toHaveCount(SBOM_SET[data_set_key].length);

    // now upload itself may take a while so increase overall test timeout
    test.setTimeout(TIMEOUT_UPLOAD_DONE);

    // expect name of each sbom to be in the list of results
    await expect(
      individual_results.locator(
        ".pf-v6-c-multiple-file-upload__status-item-progress-text"
      )
    ).toContainText(SBOM_SET[data_set_key], {
      timeout: TIMEOUT_UPLOAD_DONE,
    });

    // expect result for each sbom to be present and have 100% state
    await expect(
      individual_results.locator(
        ".pf-v6-c-progress__status .pf-v6-c-progress__measure"
      )
    ).toContainText(new Array(SBOM_SET[data_set_key].length).fill("100%"), {
      timeout: TIMEOUT_UPLOAD_DONE,
    });
  }
);
