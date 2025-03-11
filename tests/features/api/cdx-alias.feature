# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2046

Feature: Denote CPE/pURL aliases of a component in a CycloneDX SBOM
    As a Devsecops Engineer
    I want to find a component by its name, CPE/pURL or alias and I want to be able to see all aliases for a component.

Background:
    Given User is using an instance of the TPA Application.
    And User has successfully uploaded a CycloneDX SBOM that contains an alias (evidence / identity field) for a component.

# These have been scratched out of the Jira.
# Scenario Outline: Searching for a component using CPE / CPE alias / name
# Scenario Outline: Querying for a component using CPE / CPE alias / name

Scenario Outline: Searching for a component using pURL / pURL alias / name
    When User sends a pURL <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v1/purl?q=<identifier> (search)
    # E.g.: HTTP GET /api/v1/purl/<identifier> (query)
    # How should this be denoted?
    Then API should return a response containing the UUID, identifier and identifier alias of the component

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | alias         |
        | query         | name          |

Scenario Outline: Analyzing a component
    When User sends an analysis GET request of a <component_type> using <identifier>
    # E.g.: HTTP GET /api/v2/analysis/<component_type>/<CPE>
    # E.g.: HTTP GET /api/v2/analysis/<component_type>/<pURL>
    Then API should return a response containing an array of CPE and CPE aliases and an array of pURL and pURL aliases

    Examples:
        | component_type    | identifier    |
        | component         | CPE           |
        | component         | pURL          |
        | root-component    | CPE           |
        | root-component    | pURL          |
        | dep               | CPE           |
        | dep               | pURL          |

Scenario Outline: Searching for an SBOM
    When User sends a <request_type> GET request for an SBOM
    # E.g.: HTTP GET /api/v2/sbom?q={identifier} (search)
    # E.g.: HTTP GET /api/v2/sbom/{identifier} (query)
    Then API should return a response containing an array of CPE and CPE aliases and an array of pURL and pURL aliases for each component

    Examples:
        | request_type  |
        | search        |
        | query         |
