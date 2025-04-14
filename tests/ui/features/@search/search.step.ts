import { SearchPage } from "../../helpers/SearchPage";
import { ToolbarTable } from "../../helpers/ToolbarTable";
import { Tabs } from "../../helpers/Tabs";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then } = createBdd();

Given('User is on the Search page', async ({page}) => {
    const searchPage = new SearchPage(page);
    await searchPage.open();    
});

Then("Download link should be available for the {string} list", async ({ page }, type:string) => {
  var name = "";
  if (type === "SBOMs"){
    name = "sbom-table";
  } else if (type === "Advisories"){
    name = "advisory-table";

  }
  const table = new ToolbarTable(page,name);
  await table.verifyDownloadLink(type);
});

When('user starts typing a {string} in the search bar', async ({ page }, searchText: string) => {
    const searchPage = new SearchPage(page);
    await searchPage.typeInSearchBox(searchText);
});

Then("The autofill drop down should not show any values", async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.autoFillIsNotVisible();
});

When('user types a {string} in the search bar', async ({page},searchText:string) => {
    const searchPage = new SearchPage(page);
    await searchPage.typeInSearchBox(searchText);
});

When('user presses Enter', async ({page}) => {
   await page.keyboard.press('Enter'); 
});

Then('the {string} list should display the specific {string}', async ({page},type:string, name:string) => {
    const tabs = new Tabs(page);
    await tabs.verifyTabIsSelected(type);
    const table = new ToolbarTable(page,type);
    await table.verifyColumnContainsText("Name",name);
});

Then('the list should be limited to {int} items or less', async ({page}, count:number) => {
    const table = new ToolbarTable(page,"sbom-table");
    await table.verifyTableHasUpToRows(count);

});

Then('the user should be able to filter <types>', async ({}) => {
  // Step: And the user should be able to filter <types>
  // From: tests/ui/features/@search/search.feature:65:3
});

Then('user clicks on the {string} name', async ({}, arg: string) => {
  // Step: And user clicks on the "<type>" name
  // From: tests/ui/features/@search/search.feature:66:3
});

Then('the user should be navigated to the specific {string} page', async ({}, arg: string) => {
  // Step: And the user should be navigated to the specific "<type>" page
  // From: tests/ui/features/@search/search.feature:67:3
});
