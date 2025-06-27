export type SidebarMenu =
  | "Dashboard"
  | "Search"
  | "SBOMs"
  | "Vulnerabilities"
  | "Packages"
  | "Advisories"
  | "Importers"
  | "Upload";

export const SBOMListPage = {
  toolbarAriaLabel: "sbom-toolbar",
  tableAriaLabel: "sbom-table",
  paginationIdTop: "sbom-table-pagination-top",
  paginationIdBottom: "sbom-table-pagination-bottom",
  filters: {
    filterText: "Filter text",
    createdOn: "Created on",
    label: "Label",
  },
};

export const VulnerabilityListPage = {
  toolbarAriaLabel: "vulnerability-toolbar",
  tableAriaLabel: "vulnerability-table",
  paginationIdTop: "vulnerability-table-pagination-top",
  paginationIdBottom: "vulnerability-table-pagination-bottom",
  filters: {
    filterText: "Filter text",
  },
};

export const isSorted = (arr: string[], asc: boolean) => {
  let sorted = [...arr].sort((a, b) => a.localeCompare(b));
  if (!asc) {
    sorted = sorted.reverse();
  }
  return arr.every((val, i) => val === sorted[i]);
};
