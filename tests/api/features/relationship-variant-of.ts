import { PurlService } from "../client";
import { expect, test } from "../fixtures";

// Effectively tests TC-2052 / TC-2053 - Denote image index to arch image variants relationship.

const cdxBinaryImagePurl =
  "pkg:oci/ose-console@sha256:c2d69e860b7457eb42f550ba2559a0452ec3e5c9ff6521d758c186266247678e?arch=s390x&os=linux&tag=v4.14.0-202412110104.p0.g350e1ea.assembly.stream.el8";
const cdxIndexImagePurl =
  "pkg:oci/openshift-ose-console@sha256:94a0d7feec34600a858c8e383ee0e8d5f4a077f6bbc327dcad8762acfcf40679";
const spdxBinaryImagePurl =
  "pkg:oci/ubi9-container@sha256:d4c5d9c980678267b81c3c197a4a0dd206382111c912875a6cdffc6ca319b769?arch=aarch64&repository_url=registry.redhat.io/ubi9&tag=9.2-755.1697625012";
const spdxIndexImagePurl =
  "pkg:oci/ubi9-container@sha256:2f168398c538b287fd705519b83cd5b604dc277ef3d9f479c28a2adb4d830a49?repository_url=registry.redhat.io/ubi9&tag=9.2-755.1697625012";

test("Variant of / CDX / Binary image has ancestors that include index image / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedBinaryImagePurl = encodeURIComponent(cdxBinaryImagePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedBinaryImagePurl}?ancestors=10`
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxBinaryImagePurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "variant",
            purl: expect.arrayContaining([cdxIndexImagePurl]),
          }),
        ]),
      }),
    ])
  );
});

test("Variant of / CDX / Index image has descendants that include binary image / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedIndexImagePurl = encodeURIComponent(cdxIndexImagePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedIndexImagePurl}?descendants=10`
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxIndexImagePurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "variant",
            purl: expect.arrayContaining([cdxBinaryImagePurl]),
          }),
        ]),
      }),
    ])
  );
});

test("Variant of / SPDX / Binary image has ancestors that include index image / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedBinaryImagePurl = encodeURIComponent(spdxBinaryImagePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedBinaryImagePurl}?ancestors=10`
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxBinaryImagePurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "variant",
            purl: expect.arrayContaining([spdxIndexImagePurl]),
          }),
        ]),
      }),
    ])
  );
});

test("Variant of / SPDX / Index image has descendants that include binary image / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedIndexImagePurl = encodeURIComponent(spdxIndexImagePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedIndexImagePurl}?descendants=10`
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxIndexImagePurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "variant",
            purl: expect.arrayContaining([spdxBinaryImagePurl]),
          }),
        ]),
      }),
    ])
  );
});
