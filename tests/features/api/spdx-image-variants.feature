# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2053

Feature: Denote the relationship between an image and its variants
    As a Devsecops Engineer
    I want to display the relationship between an image index container and its corresponding binary container components

Background:
    Given User is using an instance of the TPA Application.
    And User has ingested an SBOM that contains a "relationships/relationshipType: 'VARIANT_OF'" element for a component

# Note that the support for the purl endpoint has been removed from the requirements. This is mentioned in the Jira comments.

Scenario Outline: Displaying the variants of a root component
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing an array of variants that have the "VARIANT_OF" relationship with the package

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

Scenario Outline: Displaying the root component of a variant
    When User sends a dependency analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/dep/<identifier> (query)
    Then API should return a response containing an element in an array of dependencies that has the "VARIANT_OF" relationship with the package

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

# We should definitely consider test cases with multiple variants and nested variants, but I haven't yet seen a good SBOM example of this.