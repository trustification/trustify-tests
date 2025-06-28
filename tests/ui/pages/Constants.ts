export const DetailsPage_SBOM = {
  packagesTab: {
    toolbarAriaLabel: "Package toolbar",
    tableAriaLabel: "Package table",
    paginationIdTop: "package-table-pagination-top",
    paginationIdBottom: "package-table-pagination-bottom",
    filters: {
      filterText: "Filter text",
      license: "License",
    },
  },
};

export const isSorted = (arr: string[], asc: boolean) => {
  let sorted = [...arr].sort((a, b) => a.localeCompare(b));
  if (!asc) {
    sorted = sorted.reverse();
  }
  return arr.every((val, i) => val === sorted[i]);
};
