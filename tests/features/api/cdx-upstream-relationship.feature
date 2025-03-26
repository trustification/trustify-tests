# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2054

Feature: Denote the relationship between downstream and upstream components
    As a Devsecops Engineer
    I want to display the relationship between a component and its upstream ancestor.

Background:
    Given User is using an instance of the TPA Application.

# The Jira doesn't include an example of what the output should look like on the purl endpoint, but it's still included in the requirements, unlike with some of the other Atlas / CAMP features, so I'm assuming this
# requirement is still valid.

Scenario Outline: Displaying the non-nested upstream ancestors using the purl endpoint
    Given User has ingested an SBOM that contains a non-nested "pedigree/ancestors" element for a component
    When User sends a <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/purl?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/purl/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical

    Example:
        | request_type  | identifier    |
        | search        | pURL          |
        | query         | pURL          |

Scenario Outline: Displaying the nested upstream ancestors using the purl endpoint
    Given User has ingested an SBOM that contains a nested "pedigree/ancestors" element for a component
    When User sends a <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/purl?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/purl/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical
    And The ancestor displayed should be the last element of the deepest nested array of ancestors in the ingested SBOM

    Example:
        | request_type  | identifier    |
        | search        | pURL          |
        | query         | pURL          |

Scenario Outline: Displaying non-nested upstream ancestors of a root component
    Given User has ingested an SBOM that contains a non-nested "pedigree/ancestors" element for a component
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

Scenario Outline: Displaying nested upstream ancestors of a root component
    Given User has ingested an SBOM that contains a nested "pedigree/ancestors" element for a component
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical
    And The ancestor displayed should be the last element of the deepest nested array of ancestors in the ingested SBOM

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

Scenario Outline: Displaying non-nested upstream ancestors of dependencies
    Given User has ingested an SBOM that contains a non-nested "pedigree/ancestors" element for a component
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

Scenario Outline: Displaying nested upstream ancestors of dependencies
    Given User has ingested an SBOM that contains a nested "pedigree/ancestors" element for a component
    When User sends a root-component analysis <request_type> GET request containing an <identifier>
    # E.g.: HTTP GET /api/v2/analysis/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/dep/<identifier> (query)
    Then API should return a response containing a single element array of ancestors that have the "AncestorOf" relationship with the package
    And The "sbom_id" of the product and the "sbom_id" of the ancestor should be identical
    And The ancestor displayed should be the last element of the deepest nested array of ancestors in the ingested SBOM

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