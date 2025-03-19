import { expect, test } from "../fixtures";
import { PurlService, SbomService, VulnerabilityService } from "../client";
import { qBuilder } from "../helpers/params";

test.skip("Examples of OpenAPI based Client/SDK usage", () => {
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

  test("List first 10 sboms by name - openapi", async ({ client }) => {
    const serviceResponse = await SbomService.listSboms({
      client,
      query: {
        offset: 0,
        limit: 10,
        sort: "name:asc",
      },
    });

    expect(serviceResponse.data).toEqual(
      expect.objectContaining({
        total: 6,
      })
    );
  });

  test("Filter Vulnerabilities by severity - openapi", async ({ client }) => {
    const serviceResponse = await VulnerabilityService.listVulnerabilities({
      client,
      query: {
        offset: 0,
        limit: 10,
        sort: "published:asc",
        q: qBuilder("CVE-2023-2", [
          {
            field: "average_severity",
            operator: "=",
            value: {
              list: ["medium", "high"],
              operator: "OR",
            },
          },
        ]),
      },
    });

    expect(serviceResponse.data).toEqual(
      expect.objectContaining({
        total: 13,
      })
    );
  });
});
