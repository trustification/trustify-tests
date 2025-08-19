Feature: Upload SBOM

    Background:
        Given User is authenticated

    Scenario Outline: Verify Upload SBOM page content
       When User visits Upload page
       Then SBOM upload tab is selected
       And Drag and drop instructions are visible
       And Upload button is present
       And Accepted file types are described

    Scenario Outline: Upload single SBOM
        Given User visits Upload page
        When User uploads "single SBOM"
        Then Total uploaded count is shown for "single SBOM"
        And Results of uploading "single SBOM" are visible

    Scenario Outline: Upload multiple SBOMs
        Given User visits Upload page
        When User uploads "multiple SBOMs"
        Then Total uploaded count is shown for "multiple SBOMs"
        And Results of uploading "multiple SBOMs" are visible
