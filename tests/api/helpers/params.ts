export interface HubFilter {
  field: string;
  operator?: "=" | "!=" | "~" | ">" | ">=" | "<" | "<=";
  value:
    | string
    | number
    | {
        list: (string | number)[];
        operator?: "AND" | "OR";
      };
}

export const qBuilder = (
  filterText: string = "",
  filters: HubFilter[] = []
): string => {
  return requestParamsQuery([
    {
      field: "",
      value: filterText,
    },
    ...filters,
  ]);
};

const requestParamsQuery = (filters: HubFilter[]): string => {
  return filters
    .filter((f) => {
      const { value } = f;
      return typeof value === "string" || typeof value === "number"
        ? true
        : value.list.length > 0;
    })
    .sort((a, b) => a.field.localeCompare(b.field))
    .map(serializeFilterForHub)
    .join("&");
};

/**
 * Converts a single filter object (HubFilter, the higher-level inspectable type) to the query string filter format used by the hub API
 */
const serializeFilterForHub = (filter: HubFilter): string => {
  const { field, operator, value } = filter;
  const joinedValue =
    typeof value === "string"
      ? value
      : typeof value === "number"
        ? `"${value}"`
        : `${value.list.join(value.operator === "OR" ? "|" : ",")}`;

  if (!field) {
    return joinedValue;
  } else {
    return `${field}${operator}${joinedValue}`;
  }
};
