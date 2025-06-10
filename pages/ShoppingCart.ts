
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ShoppingCart extends BasePage {
    readonly headingAvailableCourses: Locator;
    readonly allCourses: Locator;
    readonly SDETCourseandCypressPlaywright: Locator;
    readonly Playwright: Locator;
    readonly Cypress: Locator;
    readonly courseImg: Locator;
    readonly nameTag: Locator;
    readonly priceforCourse: Locator;
    readonly discountTag: Locator;
    readonly addToCard: Locator;
    readonly itemsAddedToCard: Locator;
    readonly totalPrice: Locator;
    readonly placeOrderButton: Locator;
    readonly addedCourseDisplay: Locator;
    readonly successMessage: Locator;
    readonly finalPrice: Locator;




    constructor(page: Page) {
        super(page);
        this.headingAvailableCourses = page.locator('.mt-2')
        this.allCourses = page.locator("[id^='course']")
        this.SDETCourseandCypressPlaywright = page.locator('#course-1')
        this.Playwright = page.locator('#course-2')
        this.Cypress = page.locator('#course-3')
        this.courseImg = page.locator('[alt^="Course"]')
        this.nameTag = page.locator('p[class="my-3"]')
        this.priceforCourse = page.locator('[data-testid="full-price"]')
        this.discountTag = page.locator('[data-testid="discount"]')  //
        this.addToCard = page.getByRole('button', { name: 'Add to Car' })
        this.itemsAddedToCard = page.locator("p[class='mb-2']")
        this.totalPrice = page.locator('#total-price')
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' })
        this.addedCourseDisplay = page.locator('.course-card ')
        this.finalPrice = page.locator('[data-testid="final-price"]')
        this.successMessage = page.locator('.notification')




    }
    ////// Methods
    async clickAddButton(index: number) {
        await this.addToCard.nth(index).click()
    }

    async clickAddButtonAllCourses() {
        for (let i = 0; i <= 2; i++) {
            await this.clickAddButton(i)
        }
    }
}