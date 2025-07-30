Feature: Advisory Explorer
    Background: Authentication
        Given User is authenticated

    # Search for advisories
    Scenario: Search for an advisory using the general search bar
        
        When User searches for an advisory named "<advisoryID>" in the general search bar
        
        Then The advisory "<advisoryID>" shows in the results

        Examples:
            | advisoryID      |
            | CVE-2024-26308  |
    
    Scenario: Search for an advisory using the dedicated search bar

        When User searches for "<advisoryID>" in the dedicated search bar
        
        Then The advisory "<advisoryID>" shows in the results

        Examples:
            | advisoryID      |
            | CVE-2024-26308  |

    # Advisory Explorer
    Scenario: Display an overview of an advisory

        When User visits Advisory details Page of "<advisoryID>"

        Then The page title is "<advisoryID>"
        Then The "Download" button is visible

        Examples:
            | advisoryID      |
            | CVE-2024-26308  |

    Scenario: Download an advisory

        When User visits Advisory details Page of "<advisoryID>"
        And User clicks the "Download" button

        Then File with the name "<fileName>" is downloaded

        Examples:
            | advisoryID      | fileName            |
            | CVE-2024-26308  | CVE-2024-26308.json |

    Scenario: Display the Info tab

        When User visits Advisory details Page of "<advisoryID>"

        Then The "Overview" panel is visible
        Then The "Publisher" panel is visible
        Then The "Tracking" panel is visible

        Examples:
            | advisoryID      |
            | CVE-2024-26308  |

    Scenario: Display the Vulnerabilities tab
        
        When User visits Advisory details Page of "<advisoryID>"
        And User selects the Tab "Vulnerabilities"

        Then The vulnerabilities table is sorted by "ID"
        And The vulnerabilities table total results is 1
        And The "ID" column of the vulnerability table contains "<vulnerabilityID>"
        And The "Title" column of the vulnerability table contains "<vulnerabilityTitle>"
        And The "Discovery" column of the vulnerability table contains "<vulnerabilityDiscovery>"
        And The "Release" column of the vulnerability table contains "<vulnerabilityRelease>"
        And The "Score" column of the vulnerability table contains "<vulnerabilityScore>"
        And The "CWE" column of the vulnerability table contains "<vulnerabilityCWE>"

        Examples:
            | advisoryID    | vulnerabilityID | vulnerabilityTitle                                          | vulnerabilityDiscovery    | vulnerabilityRelease  | vulnerabilityScore | vulnerabilityCWE |
            | CVE-2023-3223 | CVE-2023-3223   | undertow: OutOfMemoryError due to @MultipartConfig handling | May 24, 2023              | Aug 07, 2023          |                    | CWE-789          |
