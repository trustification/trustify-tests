Feature: Advisory Explorer
    Background: Authentication
        Given User is authenticated

# Advisory Vulnerabilities
Scenario: Display vulnerabilities tied to a single advisory
    Given User visits Advisory details Page of "<advisoryName>"
    Then User navigates to the Vulnerabilites tab on the Advisory Overview page
    Then A list of all active vulnerabilites tied to the advisory should display
    And The ID, Title, Discovery, Release, Score and CWE information should be visible for each vulnerability
    And The vulnerabilities should be sorted by ID by default
    And User visits Vulnerability details Page of "<vulnerabilityID>" by clicking it

    Examples:
        | advisoryName    | vulnerabilityID | 
        | GHSA-526j-mv3p-f4vv | CVE-2025-54379   | 

