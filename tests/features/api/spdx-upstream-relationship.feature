# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2055

Feature: Denote the relationship between downstream and upstream components
    As a Devsecops Engineer
    I want to display the relationship between a component and its upstream ancestor.

Background:
    Given User is using an instance of the TPA Application.
    And User has ingested an SBOM that contains a "ANCESTOR_OF" relationship for a component

# This Jira doesn't mention the purl endpoint nor does it mention nested ancestors.

Scenario Outline: Displaying the upstream ancestors of a root component
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical

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

Scenario Outline: Displaying the upstream ancestors of dependencies
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/dep/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical

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
