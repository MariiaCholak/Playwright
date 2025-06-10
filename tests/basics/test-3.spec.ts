import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.techglobal-training.com/');
  await page.locator('.HeroBanner_container__iInji > div').click();
  await page.locator('.HeroBanner_container__iInji > div').click();
});