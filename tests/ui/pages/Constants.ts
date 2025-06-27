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
  tableAriaLabel: "Vulnerability table",
  paginationIdTop: "vulnerability-table-pagination-top",
  paginationIdBottom: "vulnerability-table-pagination-bottom",
  filters: {
    filterText: "Filter text",
    severity: "CVSS",
    createdOn: "Created on",
  },
};

export const PackageListPage = {
  toolbarAriaLabel: "package-toolbar",
  tableAriaLabel: "Package table",
  paginationIdTop: "package-table-pagination-top",
  paginationIdBottom: "package-table-pagination-bottom",
  filters: {
    filterText: "Filter text",
    type: "Type",
    architecture: "Architecture",
  },
};

export const AdvisoryListPage = {
  toolbarAriaLabel: "advisory-toolbar",
  tableAriaLabel: "advisory-table",
  paginationIdTop: "advisory-table-pagination-top",
  paginationIdBottom: "advisory-table-pagination-bottom",
  filters: {
    filterText: "Filter text",
    revision: "Revision",
    label: "Label",
  },
};

export const isSorted = (arr: string[], asc: boolean) => {
  let sorted = [...arr].sort((a, b) => a.localeCompare(b));
  if (!asc) {
    sorted = sorted.reverse();
  }
  return arr.every((val, i) => val === sorted[i]);
};
