import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.techglobal-training.com/');
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img "who we are"
    - heading "Who we are" [level=2]
    - paragraph: We are a group of experienced Software Engineers committed to maintaining a high standard of education through real-life projects and technologies.
    - img "mission"
    - heading "Our mission" [level=2]
    - paragraph: Our company's mission is to provide you with real-world industry-level experience and Software Engineering training to guide you in a way that makes you a competitive candidate to tackle in the IT world.
    - img "goal"
    - heading "Main goal" [level=2]
    - paragraph: The main goal of this website is to help TechGlobal School students practice their skills and prepare for real jobs. You'll find various testing practices, coding exercises, and essential information for every programmer.
    `);

});