import { PurlService } from "../client";
import { expect, test } from "../fixtures";

test("Purl by alias - vanilla", async ({ axios }) => {
  const vanillaResponse = await axios.get(
    "/api/v2/purl?offset=0&limit=10&q=openssl"
  );

  expect(vanillaResponse.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9?arch=aarch64",
        base: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs",
        }),
        version: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9",
          version: "3.0.7-24.el9",
        }),
        qualifiers: expect.objectContaining({
          arch: "aarch64",
        }),
      }),
      expect.objectContaining({
        purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9?arch=x86_64",
        base: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs",
        }),
        version: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9",
          version: "3.0.7-24.el9",
        }),
        qualifiers: expect.objectContaining({
          arch: "x86_64",
        }),
      }),
    ])
  );
});

test("Purl by alias - openapi", async ({ client }) => {
  const serviceResponse = await PurlService.listPurl({
    client,
    query: {
      q: "openssl",
      offset: 0,
      limit: 10,
    },
  });

  expect(serviceResponse.data?.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9?arch=aarch64",
        base: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs",
        }),
        version: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9",
          version: "3.0.7-24.el9",
        }),
        qualifiers: expect.objectContaining({
          arch: "aarch64",
        }),
      }),
      expect.objectContaining({
        purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9?arch=x86_64",
        base: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs",
        }),
        version: expect.objectContaining({
          purl: "pkg:rpm/redhat/openssl-libs@3.0.7-24.el9",
          version: "3.0.7-24.el9",
        }),
        qualifiers: expect.objectContaining({
          arch: "x86_64",
        }),
      }),
    ])
  );
});
