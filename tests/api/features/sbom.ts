import { expect, test } from "../fixtures";

import { SbomService } from "../client";

test("List first 10 sboms by name - vanilla", async ({ axios }) => {
  const vanillaResponse = await axios.get(
    "/api/v2/sbom?limit=10&offset=0&sort=name:asc"
  );
  expect(vanillaResponse.data).toEqual(
    expect.objectContaining({
      total: 6,
    })
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
