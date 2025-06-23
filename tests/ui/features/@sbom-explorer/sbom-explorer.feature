Feature: SBOM Explorer - View SBOM details
    Background: Authentication
        Given User is authenticated

    Scenario Outline: View SBOM Overview
        Given An ingested "<sbomType>" SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then The page title is "<sbomName>"
        And Tab "Info" is visible
        And Tab "Packages" is visible
        And Tab "Vulnerabilities" is visible
        But Tab "Dependency Analytics Report" is not visible

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: View SBOM Info (Metadata)
        Given An ingested "<sbomType>" SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then Tab "Info" is selected
        Then "SBOM's name" is visible
        And "SBOM's namespace" is visible
        And "SBOM's license" is visible
        And "SBOM's creation date" is visible
        And "SBOM's creator" is visible

        Examples:
            | sbomName    |
            | quarkus-bom |
    
    Scenario Outline: Downloading SBOM file
        Given An ingested "<sbomType>" SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then "Download SBOM" action is invoked and downloaded filename is "<expectedSbomFilename>"
        Then "Download License Report" action is invoked and downloaded filename is "<expectedLicenseFilename>"

        Examples:
            | sbomName    | expectedSbomFilename | expectedLicenseFilename     |
            | quarkus-bom | quarkus-bom.json     | quarkus-bom_licenses.tar.gz |
    
    Scenario Outline: View list of SBOM Packages
        Given An ingested "<sbomType>" SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Packages"
        # confirms its visible for all tabs
        Then The page title is "<sbomName>"
        Then The Package table is sorted by "Name"

        When Search by FilterText "<packageName>"
        Then The Package table is sorted by "Name"
        Then The Package table total results is 1
        Then The "Name" column of the Package table table contains "<packageName>"

        When Search by FilterText "nothing matches"
        Then The Package table total results is 0

        When User clear all filters
        Then The Package table total results is greather than 1

        Examples:
            | sbomType | sbomName    | packageName |
            | SPDX | quarkus-bom | jdom        |

    Scenario Outline: View <sbomType> SBOM Vulnerabilities
        Given An ingested "<sbomType>" SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        When User Clicks on Vulnerabilities Tab Action
        Then Vulnerability Popup menu appears with message
        Then Vulnerability Risk Profile circle should be visible
        Then Vulnerability Risk Profile shows summary of vulnerabilities
        Then SBOM Name "<sbomName>" should be visible inside the tab
        Then SBOM Version should be visible inside the tab
        Then SBOM Creation date should be visible inside the tab
        # Then List of related Vulnerabilities should be sorted by "CVSS" in descending order

        Examples:
        | sbomType | sbomName |
        | SPDX | quarkus-bom |

    @slow
    Scenario Outline: Pagination of <sbomType> SBOM Vulnerabilities
        Given An ingested "<sbomType>" SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        Then Pagination of Vulnerabilities list works
        Examples:
        | sbomType | sbomName |
        | SPDX | quarkus-bom |

    @slow
    Scenario Outline: View paginated list of <sbomType> SBOM Packages
        Given An ingested "<sbomType>" SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Packages"
        Then Pagination of Packages list works
        Examples:
        | sbomType | sbomName |
        | SPDX | quarkus-bom |
