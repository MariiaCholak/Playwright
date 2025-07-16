
import { Locator, Page } from "@playwright/test";

export class ShoppingCartPage {
  readonly page: Page;
  readonly availableCourses: Locator;
  readonly itemsInCart: Locator;
  readonly totalPrice: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.availableCourses = page.locator('[data-testid="course-card"]');
    this.itemsInCart = page.locator('[data-testid="cart-item"]');
    this.totalPrice = page.locator('[data-testid="total-price"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
  }

  getCourseByIndex(index: number): Locator {
    return this.availableCourses.nth(index);
  }

  async addCourseToCart(index: number): Promise<Locator> {
    const courseCard = this.getCourseByIndex(index);
    await courseCard.locator('button').click(); // уточни селектор кнопки
    return courseCard;
  }

  async extractNumberFromText(locator: Locator): Promise<number> {
    const textContent = await locator.textContent();
    const numericValue = textContent?.replace(/[^0-9.]/g, ''); // залишає також крапку для десяткових
    return Number(numericValue);
  }

  async getDiscountedPercentage(cartItem: Locator): Promise<number> {
    const discountLocator = cartItem.locator('[data-testid="discount"]');
    const isVisible = await discountLocator.isVisible();

    if (!isVisible) return 0;

    const discountText = await discountLocator.textContent(); // e.g., "-25%"
    const numericValue = discountText?.replace(/[^0-9]/g, '');
    return Number(numericValue);
  }

  async placeOrder(): Promise<void> {
    await this.page.locator('[data-testid="place-order-button"]').click(); // або твій актуальний локатор
  }
  async addCoursesAndGetPrices(count: number): Promise<number[]> {
    const coursePrices: number[] = [];

    for (let i = 0; i < count; i++) {
      const course = await this.addCourseToCart(i); // Додаємо курс по індексу
      const coursePrice = await this.extractNumberFromText(
        course.locator('[data-testid="full-price"]')
      );
      coursePrices.push(coursePrice);
    }

    return coursePrices;
  }

  async calculateExpectedTotalPrice(coursePrices: number[], cartItems: Locator[]): Promise<number> {
    let expectedTotalPrice = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const productPrice = coursePrices[i];

      const discountPercentage = await this.getDiscountedPercentage(cartItem);
      const discountedPrice = productPrice - (productPrice * discountPercentage) / 100;

      expectedTotalPrice += discountedPrice;
    }

    return expectedTotalPrice;
  }









}
