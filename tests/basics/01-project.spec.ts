

import { test, expect } from '@playwright/test';

test.describe('enhance students understanding of frontend automation, specifically in the context of form submission and date-picking processes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.techglobal-training.com/frontend/todo-list');
  })

  test('Test Case 01 - Todo-App Modal Verification', async ({ page }) => {
    const modal = page.locator('.panel')
    await expect(modal).toBeVisible()
    await expect(modal).toContainText('My Tasks')  ///toHaveText('' )
    await expect(page.locator("#input-add")).toBeEnabled()
    await expect(page.locator("#search")).toBeEnabled()

    const noTaskMessage = page.locator('.ml-1 >p')
    await expect(noTaskMessage).toHaveText(' No tasks found!')

  })


  test('Test Case 02 - Single Task Addition and Removal', async ({ page }) => {
    await page.locator('#input-add').fill('Sleep')
    await page.locator('#add-btn').click()

    const newTask = page.locator('#panel span').nth(1)
    await expect(newTask).toBeVisible()
    await expect(newTask).toHaveCount(1)

    await (newTask).click()
    await page.locator('#clear').click()
    await expect(newTask).toHaveCount(0)
    const noTaskMessage = page.locator('.ml-1 >p')
    await expect(noTaskMessage).toHaveText(' No tasks found!')
  })

  test('Test Case 03 - Multiple Task Operations', async ({ page }) => {
    const toDoInput = page.locator('#input-add')
    const addButton = page.locator('#add-btn')


    const toDoList = ['Eat', 'Sleep', 'Dream', 'Travel', 'Be Healthy'];
    for (let i = 0; i < toDoList.length; i++) {
      await toDoInput.fill(toDoList[i])
      await addButton.click();
    }

    /// not good -Validate that all added items match the items displayed on the list.
    // const taskItems =  await page.locator('#panel span').allInnerTexts()
    // expect(taskItems.length).toBe(toDoList.length)

    //       const taskItems = page.locator('#panel span');
    // const count = await taskItems.count();
    // expect(count).toBe(toDoList.length)

    //   for (let i = 0; i < taskItems; i++){
    //  await taskItems[i]).click()
    const taskItems = page.locator('.todo-item');
    await expect(taskItems).toHaveCount(toDoList.length);

    for (let i = 0; i < toDoList.length; i++) {
      const task = taskItems.nth(i);
      await expect(task).toBeVisible();
      console.log(' Tasks are visible');

    }
    for (let i = toDoList.length - 1; i >= 0; i--) {
      const removeAll = page.locator('svg[data-icon="circle-check"]');
      await removeAll.nth(i).click();
    }

    await page.locator('#clear').click()
    const noTaskMessage = page.locator('.ml-1 >p')
    await expect(noTaskMessage).toHaveText(' No tasks found!')


  })

  test('04 - Search and Filter Functionality in todo App', async ({ page }) => {
    const toDoInput = page.locator('#input-add')
    const addButton = page.locator('#add-btn')
    const search = page.locator("#search")


    const toDoList = ['Work', 'Cook', 'Study', 'Travel', 'Play'];
    for (let i = 0; i < toDoList.length; i++) {
      await toDoInput.fill(toDoList[i])
      await addButton.click();
    }

    const taskItems = page.locator('.todo-item');
    await expect(taskItems).toHaveCount(toDoList.length);

    const actualItems = await taskItems.allInnerTexts();
    expect(actualItems).toEqual(toDoList);

    const searchtoDo = toDoList[1]
    await search.fill(searchtoDo)

      const newTask = page.locator('#panel span').nth(1)
    await expect(newTask).toBeVisible()
    await expect(newTask).toHaveCount(1)

  })

   test('Test Case 05 - Task Validation and Error Handling', async ({ page }) => {

     const toDoInput = page.locator('#input-add')
    const addButton = page.locator('#add-btn')
    const exceedingMessage = page.locator('[class="notification is-danger"]')
    
    await (toDoInput).fill('')
    await addButton.click()
       const noTaskMessage = page.locator('.ml-1 >p')
    await expect(noTaskMessage).toHaveText('No tasks found!')

     await (toDoInput).fill('rdfijfdghjdfmvdeirutjhndhodpjkjsjlfmsjjsjj')
     await addButton.click()
     await expect(exceedingMessage).toHaveText('Error: Todo cannot be more than 30 characters!')
const item = 'Sleep'
     await (toDoInput).fill(`${item}`)
     await addButton.click()
      const newTask = page.locator('#panel span').nth(1)
    await expect(newTask).toBeVisible()
    await expect(newTask).toHaveCount(1)
     await (toDoInput).fill(`${item}`)
     await addButton.click()
     await expect(exceedingMessage).toHaveText(`Error: You already have ${item} in your todo list.`)






})

})