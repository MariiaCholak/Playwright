import { test, expect } from '../../fixtures/Page.Fixture';

test('Validate page loads', async({ frontendTestingPage }) => {
  await frontendTestingPage.clickOnProjectCard('Login Function');
  await frontendTestingPage.wait(3);
});

test('Validate API link 2', async({ backendTestingPage }) => {
  await expect(backendTestingPage.apiDocumentationLink).toBeVisible();
    await backendTestingPage.wait(3);
});