# This feature is described in these Jira and GitHub issue linked in the comments.
#
# https://issues.redhat.com/browse/TC-2048

Feature: Denote CPE/pURL relationship between a product CycloneDX SBOM and a component CycloneDX SBOM
    As a Devsecops Engineer
    I want to display the relationship between a CycloneDX product SBOM and a CycloneDX component SBOM.

Background:
    Given User is using an instance of the TPA Application.

# Analysis of product SBOMs
Scenario Outline: Analyzing a product SBOM with no component SBOM information
    Given User has ingested a product SBOM
    And User has not ingested any component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/sbom?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/sbom/<identifier> (query)
    Then API should return a response containing an empty array of ancestors that have the "PackageOf" relationship with the product SBOM
    # I'm actually not sure about this. There are no examples of how that should work.
    And A warning that the information is incomplete should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          | 

Scenario Outline: Analyzing a product SBOM with incomplete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested some component SBOMs
    And User has not ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/sbom?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/sbom/<identifier> (query)
    Then API should return a response containing an array of ancestors that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And A warning that the information is incomplete should display
    And All dependencies of ingested component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |        

Scenario Outline: Analyzing a product SBOM with complete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/sbom?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/sbom/<identifier> (query)
    Then API should return a response containing an array of ancestors that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And All dependencies of component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |

# Analysis of component SBOMs
# There is a question of if the component SBOM is supposed to have any information about a product SBOM
Scenario Outline: Analyzing a component SBOM without product SBOM information
    Given User has ingested a component SBOM
    And User has not ingested the product SBOM
    When User sends a <request_type> GET request containing an <identifier> of the component SBOM
    # E.g.: HTTP GET /api/v2/sbom?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/sbom/<identifier> (query)
    Then API should return a response denoting that the component SBOM has a "PackageOf" relationship with the product SBOM
    # I'm actually not sure about this. There are no examples of how that should work.
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And A warning that the information is incomplete should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |

Scenario Outline: Analyzing a component SBOM with product SBOM information
    Given User has ingested a component SBOM
    And User has ingested the product SBOM
    When User sends a <request_type> GET request containing an <identifier> of the component SBOM
    # E.g.: HTTP GET /api/v2/sbom?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/sbom/<identifier> (query)
    Then API should return a response denoting that the component SBOM has a "PackageOf" relationship with the product SBOM
    # I'm actually not sure about this. There are no examples of how that should work.
    And The hash of the product SBOM and the SBOMs in the array should be identical

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |

# Analysis of root components
Scenario Outline: Analyzing the root component of a component SBOM with incomplete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested some component SBOMs
    And User has not ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of an ingested component SBOM
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing an array of ancestors that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And A warning that the information is incomplete should display
    And All dependencies of ingested component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |        

Scenario Outline: Analyzing the root component of a component SBOM with complete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested some component SBOMs
    And User has not ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of an ingested component SBOM
    # E.g.: HTTP GET /api/v2/analysis/root-component?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/analysis/root-component/<identifier> (query)
    Then API should return a response containing an array of ancestors that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And All dependencies of ingested component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |       

# Analysis of dependencies
Scenario Outline: Analyzing the dependencies of an SBOM with no component SBOM information
    Given User has ingested a product SBOM
    And User has not ingested any component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/dep/<identifier> (query)
    Then API should return a response containing an empty array of dependencies that have the "PackageOf" relationship with the product SBOM
    # I'm actually not sure about this. There are no examples of how that should work.
    And A warning that the information is incomplete should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          | 

Scenario Outline: Analyzing the dependencies of an SBOM with incomplete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested some component SBOMs
    And User has not ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/dep/<identifier> (query)
    Then API should return a response containing an array of dependencies that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And A warning that the information is incomplete should display
    And All dependencies of ingested component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |        

Scenario Outline: Analyzing the dependencies of an SBOM with complete component SBOM information
    Given User has ingested a product SBOM
    And User has ingested all component SBOMs
    When User sends a <request_type> GET request containing an <identifier> of the product SBOM
    # E.g.: HTTP GET /api/v2/dep?q=<identifier> (search)
    # E.g.: HTTP GET /api/v2/dep/<identifier> (query)
    Then API should return a response containing an array of dependencies that have the "PackageOf" relationship with the product SBOM
    And The hash of the product SBOM and the SBOMs in the array should be identical
    And All dependencies of component SBOMs should display

    Examples:
        | request_type  | identifier    |
        | search        | pURL          |
        | search        | CPE           |
        | search        | alias         |
        | search        | name          |
        | query         | pURL          |
        | query         | CPE           |
        | query         | alias         |
        | query         | name          |