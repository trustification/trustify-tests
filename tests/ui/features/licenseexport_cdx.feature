
Feature: License Explorer
	As a Platform Eng
	I want to be able to download the licenses in a CSV file format from a specific SBOM

Background:
	Given User is on TPA Application
	And User successfully uploaded a CycloneDX SBOM from Upload SBOM page
	And Uploaded CycloneDX SBOM appears on Search List page under SBOMs tab

Scenario: Verify Download Licences option on SBOM Search Results page for CycloneDX SBOM
	Given User Searches for CycloneDX SBOM using Search Text box and Navigates to Search results page
	When User Selects CycloneDX SBOM of interest from the Search Results
	And User Clicks "Action" button
	Then "Download License Report" Option should be visible

Scenario: User Downloads license information for CycloneDX SBOM from SBOM Search Results page
	Given User Searches for CycloneDX SBOM using Search Text box and Navigates to Search results page
	When User Selects CycloneDX SBOM of interest from the Search Results
	And User Clicks "Action" button
	And Selects "Download License Report" option
	Then Licenses associated with the SBOM should be downloaded in ZIP format using the SBOM name

Scenario: Verify Download Licences option on SBOM Explorer page for CycloneDX SBOM
	Given User Searches for CycloneDX SBOM using Search Text box and Navigates to Search results page
	When User Selects CycloneDX SBOM of interest from the Search Results
	And User Clicks on SBOM name hyperlink from the Search Results
	Then Application Navigates to SBOM Explorer page 
	And "Download License Report" Option should be visible

Scenario: User Downloads license information for CycloneDX SBOM from SBOM Explorer page
	Given User is on SBOM Explorer page for the CycloneDX SBOM
	And User Clicks on "Download License Report" button
	Then Licenses associated with the SBOM should be downloaded in ZIP format using the SBOM name

Scenario: Verify the files on downloaded CycloneDX SBOM license ZIP
	Given User has Downloaded the License information for CycloneDX SBOM
	When User extracts the Downloaded license ZIP file
	Then Extracted files should contain two CSVs, one for Package license information and another one for License reference

Scenario: Verify the headers on CycloneDX SBOM package License CSV file
	Given User extracted the CycloneDX SBOM license compressed file
	When User Opens the package license information file
	Then The file should have the following headers - name, namespace, group, version, package reference, license id, license name, license expression and alternate package reference

Scenario: Verify the headers on CycloneDX SBOM License reference CSV file
	Given User extracted the CycloneDX SBOM license compressed file
	When User Opens the license reference file
	Then The file should have the following headers - licenseId, name, extracted text and comment

Scenario: Verify the contents on CycloneDX SBOM license reference CSV file
	Given User is on license reference file
	Then The License reference CSV should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license id
	Given User is on SBOM license information file
	When User selects a package with Single license id
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match "metadata.component.version" from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license id" column should match "components.license.id" from SBOM
	And The columns "namespace", "license name", "license expression", "alternate package reference" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license id with alternate package reference
	Given User is on SBOM license information file
	When User selects a package with Single license id with cpe information
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match metadata.component.version from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license id" column should match "components.license.id" from SBOM
	And "alternate package reference" column should match "components.cpe" from SBOM
	And The columns "namespace", "license name", "license expression" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license name
	Given User is on SBOM license information file
	When User selects a package with Single license name
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match metadata.component.version from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license name" column should match "components.license.name" from SBOM
	And The columns "namespace", "license id", "license expression", "alternate package reference" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license name with alternate package reference
	Given User is on SBOM license information file
	When User selects a package with Single license id with cpe information
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match metadata.component.version from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license name" column should match "components.license.name" from SBOM
	And "alternate package reference" column should match "components.cpe" from SBOM
	And The columns "namespace", "license id", "license expression" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license expression
	Given User is on SBOM license information file
	When User selects a package with Single license name
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match metadata.component.version from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license expression" column should match "components.license.name" from SBOM
	And The columns "namespace", "license id", "license name", "alternate package reference" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with single license expression with alternate package reference
	Given User is on SBOM license information file
	When User selects a package with Single license name
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match metadata.component.version from SBOM
	And "package reference" column should match "components.purl" from SBOM
	And "license expression" column should match "components.license.name" from SBOM
	And "alternate package reference" column should match "components.cpe" from SBOM
	And The columns "namespace", "license id", "license name" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with multiple license ids
	Given User is on SBOM license information file
	When User selects a package with multiple license sections
	Then The report should have multiple rows for the same package corresponding to each license section
	And Values on columns "name", "group", "version", "package reference" should be same for all the rows from SBOM
	And "license id" for each row should match the value from the components.license.id field of the corresponding license section
	And The columns "namespace", "license name", "license expression", "alternate package reference" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with multiple license names
	Given User is on SBOM license information file
	When User selects a package with multiple license sections
	Then The report should have multiple rows for the same package corresponding to each license section
	And Values on columns "name", "group", "version", "package reference", "alternate package reference" should be same for all the rows from SBOM
	And "license id" for each row should match the value from the components.license.id field of the corresponding license section
	And The columns "namespace", "license name", "license expression" should be empty

Scenario: Verify the license information for a package on the CycloneDX SBOM with license id and license name
	Given User is on SBOM license information file
	When User selects a package with multiple license sections
	Then The report should have multiple rows for the same package corresponding to each license section
	And Values on columns "name", "group", "version", "package reference" should be same for all the rows from SBOM
	And Column "license id" should match "components.license.id" on one row and on the same row license.name column should be empty
	And Column "license name" should match the "components.license.name" on another row and on the same row license.id column should be empty
	And The columns "namespace","license expression", "alternate package reference" should be empty

Scenario: Verify CycloneDX SBOM level license information on license export
	Given User is on SBOM license information file
	Then "name" column should match "metadata.component.name" from SBOM
	And "group" column should match "metadata.component.group" from SBOM
	And "version" column should match "metadata.component.version" from SBOM
	And "package reference" column should match "metadata.component.purl" from SBOM
	And "license id" column should match "metadata.component.licenses.license.id" from SBOM
	And The columns "namespace", "license name", "license expression", "alternate package reference" should be empty
