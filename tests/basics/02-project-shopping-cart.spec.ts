/*
Test Case 01 - Available Courses Section Validation
Navigate to https://techglobal-training.com/frontend/shopping-cart
Validate the heading is “Available Courses”
Validate that there are 3 courses displayed
Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero
Validate the first 2 courses have discount tags
Validate that there is an “Add to Cart” button under each course which is displayed, enabled, and has the text “Add to Cart”

Test Case 02 - Cart Section Validation
Navigate to https://techglobal-training.com/frontend/shopping-cart
Validate the heading is “Items Added to Cart”
Validate that the cart is empty by default
Validate that the total price is zero “$0” by default
Validate that there is a “Place Order” button is displayed, disabled, and has the text “Place Order”

Test Case 03 - Add a Course to the Cart and Validate
Navigate to https://techglobal-training.com/frontend/shopping-cart
Click on the “Add to Cart” button for one of the courses
Validate that the course is displayed in the cart with its image, name, and discount amount if available
Validate that the course price is added to the total price excluding the discount amount
Click on the “Place Order” button
Validate a success message is displayed with the text “Your order has been placed.”
Validate that the cart is empty

Test Case 04 - Add Two Courses to the Cart and Validate
Navigate to https://techglobal-training.com/frontend/shopping-cart
Click on the “Add to Cart” button for one of the courses
Click on the “Add to Cart” button for another course
Validate that the courses are displayed in the cart with their image, name, and discount amount if available
Validate that the course prices are added to the total price excluding the discount amounts
Click on the “Place Order” button
Validate a success message is displayed with the text “Your order has been placed.”
Validate that the cart is empty

Test Case 05 - Add All Three Courses to the Cart and Validate
Navigate to https://techglobal-training.com/frontend/shopping-cart
Click on the “Add to Cart” button for all three courses
Validate that the courses are displayed in the cart with their image, name, and discount amount if available
Validate that the course prices are added to the total price excluding the discount amounts
Click on the “Place Order” button
Validate a success message is displayed with the text “Your order has been placed.”
Validate that the cart is empty
*/

import { test, expect } from '@playwright/test';
import { ShoppingCart } from '../../pages/ShoppingCart';


test.describe("provide students with hands-on experience in automating the validation of an ecommerce website's frontend functionalities.", () => {
  let shoppingCart: ShoppingCart

  test.beforeEach(async ({ page }) => {
    shoppingCart = new ShoppingCart(page)
    await page.goto(' https://techglobal-training.com/frontend/shopping-cart');
  })

  test('Test Case 01 - Todo-App Modal Verification', async ({ page }) => {
    await expect(shoppingCart.headingAvailableCourses).toHaveText('Available Courses')

    const courseCount = await shoppingCart.allCourses.count();   //// toHaveCount(3)
    expect(courseCount).toBe(3);
   


    for (let i = 0; i < courseCount; i++) {
      const course = shoppingCart.allCourses.nth(i);
      // Перевірка, що курс видимий
      await expect(course).toBeVisible();
      // Перевірка, що є зображення
      await expect(course.locator('img')).toBeVisible();
      // Перевірка, що є назва
      await expect(course.locator(shoppingCart.nameTag)).not.toBeEmpty();

      // Перевірка, що є TechGlobal School tag 
      await expect(course).toContainText('TechGlobal school');

      const priceText = await course.locator(shoppingCart.priceforCourse).innerText();
      const price = parseFloat(priceText.replace('$', '').trim());
      expect(price).toBeGreaterThan(0);

      const addToCardButton = course.locator(shoppingCart.addToCard)
      await expect(addToCardButton).toBeVisible()
      await expect(addToCardButton).toBeEnabled()
      await expect(addToCardButton).toHaveText('Add to Cart')

    }
    await expect(shoppingCart.discountTag).toHaveCount(2);
  })

  test('Test Case 02 -  Cart Section Validation', async ({ page }) => {
    await expect(shoppingCart.itemsAddedToCard).toHaveText('Items Added to Cart')


    await expect(shoppingCart.itemsAddedToCard).toHaveText('Items Added to Cart')


    await expect(shoppingCart.totalPrice).toHaveText('Total: $0')

    const placeOrderButton = shoppingCart.placeOrderButton
    await expect(placeOrderButton).toBeVisible()
    await expect(placeOrderButton).not.toBeEnabled()
    await expect(placeOrderButton).toHaveText('Place Order')



  })

  test('Test Case 03 - Add a Course to the Cart and Validate', async ({ page }) => {
    await shoppingCart.clickAddButton(0)

    const addedCourse = await shoppingCart.addedCourseDisplay.count()   ///
    expect(addedCourse).toBe(1)

    for (let i = 0; i < addedCourse; i++) {
      const course = shoppingCart.addedCourseDisplay.nth(i)

      await expect(course).toBeVisible()

      await expect(course.locator('img')).toBeVisible()

      await expect(course).toContainText('SDET Course | Cypress Playwright')

      await expect(course.locator(shoppingCart.discountTag)).toHaveCount(1)

      await shoppingCart.clickAddButton(0);

      const fullText = await shoppingCart.priceforCourse.nth(0).innerText(); // "$100" вибирає перший курс та текст
      const discountText = await shoppingCart.discountTag.nth(0).innerText(); // "-20%" отримую текст знижки

      const full = parseFloat(fullText.replace('$', '')); // перетвор на число
      const discountPercent = parseFloat(discountText.replace('-', '').replace('%', ''));   /// 20 стає числом

      const expected = full - (full * discountPercent / 100); ///кільки становить знижка (наприклад, 100 * 20 / 100 = 20)
      //full - знижка = очікувана ціна після знижки (наприклад, 100 - 20 = 80)

      const total = parseFloat((await shoppingCart.totalPrice.innerText()).replace('Total: $', ''));
      //Отримуєш текст з загальної суми в кошику, наприклад: "Total: $80" Замінюєш "Total: $" на пустоту → "80"  parseFloat → число 80

      expect(total).toBeCloseTo(expected, 2); // порівнює з точністю до копійок
      //Порівнюєш обчислену ціну (expected) з реальною з сайту (total)  toBeCloseTo(..., 2) означає точність до 2 знаків після коми, щоб уникнути помилок типу 80.00001 !== 80
    }


    await shoppingCart.placeOrderButton.click()

    await expect(shoppingCart.successMessage).toHaveText('Your order has been placed.')

    await expect(shoppingCart.itemsAddedToCard).toHaveText('Items Added to Cart')




  })

  test('Test Case 04 - Add Two Courses to the Cart and Validate', async ({ page }) => {

    for (let i = 0; i < 2; i++) {
      const course = await shoppingCart.clickAddButton(i)   //Натискає на кнопку "Add to Cart" для першого і другого курсу.
    }
    const addedCourses = shoppingCart.addedCourseDisplay
    await expect(addedCourses).toHaveCount(2)

    const expectedTitles = [
      'SDET Course | Cypress Playwright',
      'Playwright Automation Testing',
    ];
    let expectedTotal = 0

    for (let i = 0; i < 2; i++) {
      const newOrder = addedCourses.nth(i);
      await expect(newOrder).toBeVisible()

      await expect(newOrder.locator('img')).toBeVisible()

      await expect(newOrder).toContainText(expectedTitles[i])

      await expect(newOrder.locator(shoppingCart.discountTag)).toHaveCount(1)


      const fullText = await shoppingCart.priceforCourse.nth(i).innerText(); // "$100" вибирає перший курс та текст
      const discountText = await shoppingCart.discountTag.nth(i).innerText(); // "-20%" отримую текст знижки

      const full = parseFloat(fullText.replace('$', '')); // перетвор на число
      const discountPercent = parseFloat(discountText.replace('-', '').replace('%', ''));   /// 20 стає числом

      const expected = full - (full * discountPercent / 100); ///кільки становить знижка (наприклад, 100 * 20 / 100 = 20)
      //full - знижка = очікувана ціна після знижки (наприклад, 100 - 20 = 80)
      expectedTotal += expected;   //Додає ціну одного курсу (після знижки) до загальної очікуваної суми. expectedTotal = 80 + 90 = 170


    }
    const totalText = await shoppingCart.totalPrice.innerText() /// 160 Отримує текстову версію фактичної загальної суми з інтерфейсу сайту, наприклад: "Total: $170".
    const total = parseFloat((await totalText).replace('Total: $', ''));
    //Отримуєш текст з загальної суми в кошику, наприклад: "Total: $80" Замінюєш "Total: $" на пустоту → "80"  parseFloat → число 80

    expect(total).toBeCloseTo(expectedTotal, 2); // порівнює з точністю до копійок
    //Порівнюєш обчислену ціну (expected) з реальною з сайту (total)  toBeCloseTo(..., 2) означає точність до 2 знаків після коми, щоб уникнути помилок типу 80.00001 !== 80

    await shoppingCart.placeOrderButton.click()

    await expect(shoppingCart.successMessage).toHaveText('Your order has been placed.')

    await expect(shoppingCart.itemsAddedToCard).toHaveText('Items Added to Cart')

    await page.waitForTimeout(3000);

  })


  test('Test Case 05 - Add All Three Courses to the Cart and Validate', async ({ page }) => {
    await shoppingCart.clickAddButtonAllCourses()
    const addedCourses = shoppingCart.addedCourseDisplay
    await expect(addedCourses).toHaveCount(3)

    const expectedTitles = [
      'SDET Course | Cypress Playwright',
      'Playwright Automation Testing',
      'Cypress Automation Course'
    ];
    let expectedTotal = 0

    for (let i = 0; i <= 2; i++) {
      const newOrder = addedCourses.nth(i);
      await expect(newOrder).toBeVisible()

      await expect(newOrder.locator('img')).toBeVisible()

      await expect(newOrder).toContainText(expectedTitles[i])

      const discount = await newOrder.locator(shoppingCart.discountTag).count()
      expect(discount === 0 || discount === 1).toBeTruthy()
      //newOrder.locator(shoppingCart.discountTag): Це шукає всі елементи, що мають клас або атрибут, визначений як shoppingCart.discountTag (можливо, це локатор для елементів з класом або атрибутом, який позначає знижку).
      //.count(): Цей метод повертає кількість знайдених елементів, тобто скільки елементів з цією знижкою знаходиться у поточному курсі.


      const fullText = await shoppingCart.finalPrice.nth(i).innerText(); // "$100" вибирає перший курс та текст
      // "-20%" отримую текст знижки

      const full = parseFloat(fullText.replace('$', '')); // перетвор на число
      let discountPercent = 0  /// створюється на початку, тобто буде доступна в усьому блоці. Якщо є знижка, вона перезаписується. Якщо немає — залишиться 0, і ціна залишиться повною.
      if (discount === 1) {
        const discountText = await newOrder.locator(shoppingCart.discountTag).innerText();
        discountPercent = parseFloat(discountText.replace('-', '').replace('%', '')) || 0;   /// 20 стає числом
      }
      const expected = full - (full * discountPercent / 100); ///кільки становить знижка (наприклад, 100 * 20 / 100 = 20)
      //full - знижка = очікувана ціна після знижки (наприклад, 100 - 20 = 80)
      expectedTotal += expected;   //Додає ціну одного курсу (після знижки) до загальної очікуваної суми. expectedTotal = 80 + 90 = 170
      console.log(`Course ${i + 1}`);
      console.log(`Title: ${expectedTitles[i]}`);
      console.log(`Full price: ${full}`);
      console.log(`Discount percent: ${discountPercent}`);
      console.log(`Expected (after discount): ${expected}`);

    }
    const totalText = await shoppingCart.totalPrice.innerText() /// 160 Отримує текстову версію фактичної загальної суми з інтерфейсу сайту, наприклад: "Total: $170".
    const total = parseFloat(totalText.replace('Total: $', ''));
    //Отримуєш текст з загальної суми в кошику, наприклад: "Total: $80" Замінюєш "Total: $" на пустоту → "80"  parseFloat → число 80


    expect(total).toBeCloseTo(expectedTotal, 2); // порівнює з точністю до копійок
    //Порівнюєш обчислену ціну (expected) з реальною з сайту (total)  toBeCloseTo(..., 2) означає точність до 2 знаків після коми, щоб уникнути помилок типу 80.00001 !== 80

    await shoppingCart.placeOrderButton.click()

    await expect(shoppingCart.successMessage).toHaveText('Your order has been placed.')

    await expect(shoppingCart.itemsAddedToCard).toHaveText('Items Added to Cart')

    await page.waitForTimeout(3000);



  })
})



