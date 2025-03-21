# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2051

Feature: Denote the relationship between a source RPM and binary RPM in an SPDX SBOM
    As a Devsecops Engineer
    I want to display the relationship between a source RPM and binary RPM

Background:
    Given User is using an instance of the TPA Application.
    And User has ingested an SBOM that contains the "GENERATED_FROM" relationship between dependency packages

# Note that the support for the purl and cpe endpoints have been removed from the requirements. This is mentioned in the Jira comments.

Scenario Outline: Displaying the relationship when analyzing a root component
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing an array of ancestors that have the "GeneratedFrom" relationship with the package

    Example:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |

Scenario Outline: Displaying the relationship when analyzing dependencies
    When User sends a dependency analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/dep/<identifier> (query)
    Then API should return a response containing an array of dependencies that have the "GeneratedFrom" relationship with the package

    Example:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |