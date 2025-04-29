Feature: Advisory Explorer
    Background: Authentication
        Given User is authenticated

    # Search for advisories
    Scenario: Search for an advisory using the general search bar
        When User searches for an advisory named "<advisoryID>" in the general search bar
        Then The advisory "<advisoryID>" shows in the results

        Examples:
            | advisoryID      |
            | CVE-2023-1664   |
    
    Scenario: Search for an advisory using the dedicated search bar
        When User searches for "<advisoryID>" in the dedicated search bar
        Then The advisory "<advisoryID>" shows in the results

        Examples:
            | advisoryID      |
            | CVE-2023-1664   |

