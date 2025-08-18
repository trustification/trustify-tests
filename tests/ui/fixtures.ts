import { test as base } from "playwright-bdd";
import { expect, Page, TestInfo } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Istanbul coverage data interface
interface IstanbulCoverage {
  [filePath: string]: {
    path: string;
    statementMap: Record<string, any>;
    fnMap: Record<string, any>;
    branchMap: Record<string, any>;
    s: Record<string, number>;
    f: Record<string, number>;
    b: Record<string, number>;
  };
}

// Helper function to collect coverage from page
async function collectCoverage(page: Page): Promise<IstanbulCoverage | null> {
  try {
    const coverage = await page.evaluate(() => {
      return (window as any).__coverage__ || null;
    });

    if (coverage && typeof coverage === "object") {
      // Filter and validate coverage data
      const validCoverage: IstanbulCoverage = {};

      for (const [filePath, fileData] of Object.entries(coverage)) {
        if (fileData && typeof fileData === "object") {
          validCoverage[filePath] = fileData as any;
        }
      }

      return Object.keys(validCoverage).length > 0 ? validCoverage : null;
    }

    return null;
  } catch (error) {
    // Silently fail - coverage collection shouldn't break tests
    return null;
  }
}

// Helper function to save coverage data
async function saveCoverage(
  coverage: IstanbulCoverage,
  testInfo: TestInfo
): Promise<void> {
  try {
    const coverageDir = join(process.cwd(), ".nyc_output");

    // Ensure .nyc_output directory exists
    if (!existsSync(coverageDir)) {
      mkdirSync(coverageDir, { recursive: true });
    }

    // Generate filename based on test info
    const timestamp = Date.now();
    const filename = `coverage-${testInfo.workerIndex}-${timestamp}.json`;
    const filePath = join(coverageDir, filename);

    // Save in Istanbul format
    writeFileSync(filePath, JSON.stringify(coverage, null, 2));
  } catch (error) {
    // Silently fail - coverage collection shouldn't break tests
  }
}

// Coverage fixtures type
type CoverageFixtures = {
  autoCoverage: void;
};

// Clean test fixtures with automatic coverage collection
export const test = base.extend<CoverageFixtures>({
  // Auto-coverage fixture that runs automatically for every test
  autoCoverage: [
    async ({ page }, use, testInfo) => {
      // Use (do nothing during test execution)
      await use();

      // Automatically collect and save coverage after each test
      // This happens transparently without test code needing to know about it
      const coverage = await collectCoverage(page);
      if (coverage) {
        await saveCoverage(coverage, testInfo);
      }
    },
    { auto: true },
  ],
});

// Re-export expect for convenience
export { expect };
