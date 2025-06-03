
import { test, expect } from '@playwright/test';


  test('', async ({ page }) => {
    await page.goto('https://www.google.com/')
expect(await page.title()).toBe('Google')

    await page.evaluate(() => {
        document.title
    })

  })