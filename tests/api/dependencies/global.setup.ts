import fs from "fs";
import path from "path";

import { AxiosInstance } from "axios";

import { ADVISORY_FILES, SBOM_FILES } from "../../common/constants";
import { UploadSbomResponse } from "../client";
import { test as setup } from "../fixtures";

setup.describe("Ingest initial data", () => {
  setup.skip(
    process.env.SKIP_INGESTION === "true",
    "Skipping global.setup data ingestion"
  );

  setup("Upload files", async ({ axios }) => {
    setup.setTimeout(120_000);
    await uploadSboms(axios, SBOM_FILES);
    await uploadAdvisories(axios, ADVISORY_FILES);
  });
});

const uploadSboms = async (axios: AxiosInstance, files: string[]) => {
  const uploads = files.map((e) => {
    const filePath = path.join(__dirname, `../../common/assets/sbom/${e}`);
    fs.statSync(filePath); // Verify file exists

    const fileStream = fs.createReadStream(filePath);
    return axios.post<UploadSbomResponse>("/api/v2/sbom", fileStream, {
      headers: { "Content-Type": "application/json+bzip2" },
    });
  });

  await Promise.all(uploads);
};

const uploadAdvisories = async (axios: AxiosInstance, files: string[]) => {
  const uploads = files.map((e) => {
    const filePath = path.join(__dirname, `../../common/assets/csaf/${e}`);
    fs.statSync(filePath); // Verify file exists

    const fileStream = fs.createReadStream(filePath);
    return axios.post<UploadSbomResponse>("/api/v2/advisory", fileStream, {
      headers: { "Content-Type": "application/json+bzip2" },
    });
  });

  await Promise.all(uploads);
};
