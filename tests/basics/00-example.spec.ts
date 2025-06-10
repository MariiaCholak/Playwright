import { test, expect } from '@playwright/test';

test.describe('Demo @Smoke', () => {
 
 
  test.beforeEach(async ({ page }) => {
  await page.goto('https://playwright.dev/');
  })

  
  test('has title', async({page}) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

})



/*
Go to https://www.wikipedia.org/
Search for "Playwright"
Validate the url contains "Playwright"
Validate the title contains "Playwright"
Validate the main heading is "Playwright"
*/
test('Playwright on Wiki', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  const inputBox = page.locator('#searchInput')    //// or
  inputBox.fill('Playwright')
  await page.locator('button[type="submit"]').click()  ///('.pure-button-primary-progressive')
  await expect(page).toHaveURL(/Playwright/)
  await expect(page).toHaveTitle(/Playwright/)
  const heading = page.locator('#firstHeading')
  await expect(heading).toHaveText('Playwright')

})
test('Playwright on Wikiii', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await  page.locator('id=searchInput').fill('Playwright')    //because fill return promise i need to put await
  await page.locator('button[type="submit"]').click()
const currentUrl = page.url()
const currentTitle = await page.title()
  ///we need to have expect not console log
expect(currentUrl).toContain('Playwright')  //// this not return promis
expect(currentTitle).toContain('Playwright')
const heading = page.locator('#firstHeading')
 expect(await heading.innerText()).toBe('Playwright')
   //////playwright to be playwwrigth    ()-first

})

const dataset: string[] = ['Playwright', 'TypeScript', 'JavaScript'];

dataset.forEach((data: string) => {
  test(`Validate Wiki search for ${data}`, async({ page }) => {

    await page.goto('https://www.wikipedia.org/');
  
    await page.locator('#searchInput').fill(data);
    await page.locator('.pure-button-primary-progressive').click();
  
    expect(page.url()).toContain(data);
    expect(await page.title()).toContain(data);
    expect(await page.locator('#firstHeading').innerText()).toBe(data);
  });
});
