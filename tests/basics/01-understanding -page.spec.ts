
import { chromium, test } from "@playwright/test";

test('Setting a page', async() => {
  const browser = await chromium.launch()
 const context = await browser.newContext()
 const page = await context.newPage()

 await page.goto('https://www.techglobal-training.com/')
})

test('Visiting a page', async({ page }) => {
    await page.goto('https://www.techglobal-training.com/') 
})