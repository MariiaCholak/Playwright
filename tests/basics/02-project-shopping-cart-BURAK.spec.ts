
import { test, expect } from '@playwright/test';
import { ShoppingCartPage } from '../../pages/ShopingCardBurak';


test.describe("provide students with hands-on experience in automating the validation of an ecommerce website's frontend functionalities.", () => {
  let shoppingCart: ShoppingCartPage

  test.beforeEach(async ({ page }) => {
    shoppingCartPage = new ShoppingCartPage(page)
    await page.goto(' https://techglobal-training.com/frontend/shopping-cart');
  })
test("Test Case 01 - Available Courses Section Validation", async ({ page }) => {
  await expect(shoppingCartPage.projectHeading).toHaveText('Available Courses');
  await expect(shoppingCartPage.availableCourses).toHaveCount(3);

  const availableCourseCards = await shoppingCartPage.availableCourses.all();

  for (const courseCard of availableCourseCards) {
    await expect(courseCard.locator('img')).toBeVisible();
    await expect(courseCard.locator('h3')).toBeVisible();
    await expect(courseCard.locator('.-my-3')).toHaveText('TechGlobal School');

    const priceTag = await courseCard.locator('[data-testid="full-price"]').textContent();
    const priceAsNumber = Number(priceTag?.replace("$", ""));
    expect(priceAsNumber).toBeGreaterThan(0);
  }

  for (let i = 0; i < 2; i++) {
    const courseCard = shoppingCartPage.getCourseByIndex(i);
    const discountTag = courseCard.locator('[data-testid="discount"]');
    await expect(discountTag).toBeVisible();
  }

  const addToCartButtons = await shoppingCartPage.addCartButtons.all();
  for (const button of addToCartButtons) {
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).toHaveText('Add to Cart');
  }
});

test("Test Case 02 - Cart Section Validation", async ({ page }) => {
  await expect(shoppingCartPage.cartHeading).toHaveText('Items Added to Cart');
  await expect(shoppingCartPage.itemsInCart).toHaveCount(0);

  const totalPriceText = await shoppingCartPage.totalPrice.textContent();
  const partialPriceText = totalPriceText?.slice(totalPriceText.indexOf('$'));
  expect(partialPriceText).toEqual('$0');

  await expect(shoppingCartPage.placeOrderButton).toBeVisible();
  await expect(shoppingCartPage.placeOrderButton).toBeDisabled();
  await expect(shoppingCartPage.placeOrderButton).toHaveText('Place Order');
});

test("Test Case 03 - Add a Course to the Cart and Validate", async ({ page }) => {
  const addedCourse = await shoppingCartPage.addCourseToCart(0);

  const cartItem = shoppingCartPage.itemsInCart;
  await expect(cartItem).toHaveCount(1);

  // Validate image and title are visible
  await expect(cartItem.locator('img')).toBeVisible();
  await expect(cartItem.locator('.-mb-1.has-text-black')).toBeVisible(); // course name

  // Check if discount tag is visible
  const isDiscountTagVisible = await cartItem.locator('[data-testid="discount"]').isVisible();
  if (isDiscountTagVisible) {
    await expect(cartItem.locator('[data-testid="discount"]')).toBeVisible();
  }

  // Extract price and calculate expected total
  const initialTotalPrice = 0;
  let expectedTotalPrice = initialTotalPrice;

  const listedCoursePrice = await shoppingCartPage.extractNumberFromText(
    addedCourse.locator('[data-testid="full-price"]')
  );

  const listedDiscountedPercentage = await shoppingCartPage.getDiscountedPercentage(cartItem);
  const discountedPrice =
    listedCoursePrice - (listedCoursePrice * listedDiscountedPercentage) / 100;

  expectedTotalPrice += discountedPrice;

  const actualTotalPrice = await shoppingCartPage.extractNumberFromText(shoppingCartPage.totalPrice);
  expect(actualTotalPrice).toBe(expectedTotalPrice);

  // Place order and validate success message
  await shoppingCartPage.placeOrder();
  await expect(shoppingCartPage.successMessage).toHaveText('Your order has been placed.');
});

test("Test Case 04 - Add Two Courses to the Cart and Validate", async ({ page }) => {
  // Додаємо два курси в кошик і отримуємо масив їх локаторів
  const coursePrices = await shoppingCartPage.addCoursesAndGetPrices(2);

  // Перевірка, що в кошику два товари
  await expect(shoppingCartPage.itemsInCart).toHaveCount(2);

  const cartItems = await shoppingCartPage.itemsInCart.all();

  // Перевірка кожного товару в кошику
  for (const cartItem of cartItems) {
    await expect(cartItem.locator('img')).toBeVisible();
    await expect(cartItem.locator('.-mb-1.has-text-black')).toBeVisible(); // Назва курсу

    const isDiscountTagVisible = await cartItem.locator('[data-testid="discount"]').isVisible();
    if (isDiscountTagVisible) {
      await expect(cartItem.locator('[data-testid="discount"]')).toBeVisible();
    }
  }

  // Розрахунок очікуваної ціни з урахуванням знижок
  const expectedTotalPrice = await shoppingCartPage.calculateExpectedTotalPrice(coursePrices, cartItems);

  // Отримуємо відображену загальну суму
  const actualTotalPrice = await shoppingCartPage.extractNumberFromText(shoppingCartPage.totalPrice);

  // Порівняння фактичної та очікуваної суми
  expect(actualTotalPrice).toBe(expectedTotalPrice);

  // Оформлення замовлення та перевірка повідомлення про успіх
  await shoppingCartPage.placeOrder();
  await expect(shoppingCartPage.successMessage).toHaveText('Your order has been placed.');

  // Після оформлення замовлення — кошик має бути порожній
  await expect(shoppingCartPage.itemsInCart).toHaveCount(0);
});
test("Test Case 05 - Add All Three Courses to the Cart and Validate", async ({ page }) => {
  // Отримуємо кількість доступних курсів
  const amountOfAvailableCourses = await shoppingCartPage.availableCourses.count();

  // Додаємо всі курси до кошика та зберігаємо їх локатори/ціни
  const coursePrices = await shoppingCartPage.addCoursesAndGetPrices(amountOfAvailableCourses);

  // Перевіряємо, що в кошику правильна кількість елементів
  await expect(shoppingCartPage.itemsInCart).toHaveCount(amountOfAvailableCourses);

  const cartItems = await shoppingCartPage.itemsInCart.all();

  // Перевіряємо кожен елемент у кошику
  for (const cartItem of cartItems) {
    await expect(cartItem.locator('img')).toBeVisible();
    await expect(cartItem.locator('.-mb-1.has-text-black')).toBeVisible();

    const isDiscountTagVisible = await cartItem.locator('[data-testid="discount"]').isVisible();
    if (isDiscountTagVisible) {
      await expect(cartItem.locator('[data-testid="discount"]')).toBeVisible();
    }
  }

  // Обчислення очікуваної суми (з урахуванням знижок)
  const expectedTotalPrice = await shoppingCartPage.calculateExpectedTotalPrice(coursePrices, cartItems);

  // Отримання фактичної загальної ціни
  const actualTotalPrice = await shoppingCartPage.extractNumberFromText(shoppingCartPage.totalPrice);

  // Перевірка суми
  expect(actualTotalPrice).toBe(expectedTotalPrice);

  // Оформлення замовлення
  await shoppingCartPage.placeOrder();

  // Перевірка повідомлення про успішне замовлення
  await expect(shoppingCartPage.successMessage).toHaveText('Your order has been placed.');

  // Перевірка, що кошик очищено
  await expect(shoppingCartPage.itemsInCart).toHaveCount(0);
});


})

