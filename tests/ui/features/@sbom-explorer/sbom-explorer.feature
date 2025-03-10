Feature: SBOM Explorer - View SBOM details
    Background: Authentication
        Given User is authenticated

    Scenario Outline: View SBOM Overview
        Given User visits SBOM details Page of "<sbomName>"
        Then The page title is "<sbomName>"
        And Tab "Info" is visible
        And Tab "Packages" is visible
        And Tab "Vulnerabilities" is visible
        But Tab "Dependency Analytics Report" is not visible

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: View SBOM Info (Metadata)
        Given User visits SBOM details Page of "<sbomName>"
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
        Given User visits SBOM details Page of "<sbomName>"
        Then "Download" button is clicked and file corresponds to SBOM "<sbomName>"

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: View list of SBOM Packages
        Given User visits SBOM details Page of "<sbomName>"
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
            | sbomName    | packageName |
            | quarkus-bom | jdom        |
