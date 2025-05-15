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

    # Advisory Explorer
    Scenario: Display an overview of an advisory
        When User visits Advisory details Page of "<advisoryID>"
        Then The page title is "<advisoryID>"
        Then The "Download" button is visible

        Examples:
            | advisoryID      |
            | CVE-2023-1664   |

    Scenario: Download an advisory
        When User visits Advisory details Page of "<advisoryID>"
        And User clicks the "Download" button
        Then File with the name "<fileName>" is downloaded

        Examples:
            | advisoryID      | fileName                                   |
            | CVE-2023-1664   | https___www.redhat.com_#CVE-2023-1664.json |

    Scenario: Display the Info tab
        When User visits Advisory details Page of "<advisoryID>"
        Then The "Overview" panel is visible
        Then The "Publisher" panel is visible
        Then The "Tracking" panel is visible

        Examples:
            | advisoryID      |
            | CVE-2023-1664   |
