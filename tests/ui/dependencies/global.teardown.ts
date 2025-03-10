import { test as teardown } from "@playwright/test";

teardown.describe("Delete initial data", () => {
  teardown.skip(
    process.env.SKIP_INGESTION === "true",
    "Skipping global.teardown data cleanup"
  );

  teardown("SBOMs", async ({}) => {
    console.log("deleting test data...");
    // Delete the database
  });
});
