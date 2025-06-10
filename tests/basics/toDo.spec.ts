
import { test, expect } from "@playwright/test";
import { TodoPage } from "../../pages/TodoPage";

test.describe("Todo project", () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await page.goto("https://techglobal-training.com/frontend/project-6");
  });

  test("Test Case 01 - Todo-App Modal Verification", async () => {
    await expect(todoPage.todoAppModal).toBeVisible();
    await expect(todoPage.todoAppHeading).toHaveText("My Tasks");
    await expect(todoPage.newTodoInput).toBeEnabled();
    await expect(todoPage.addButton).toBeEnabled();
    await expect(todoPage.searchField).toBeEnabled();
    await expect(todoPage.taskList).toHaveText("No tasks found!");
  });

  test.describe("Todo project", () => {
  test("Test Case 02 - Single Task Addition and Removal", async ({ page }) => {
    const taskName = 'Task 1';
   

    // Додаємо нове завдання
    await todoPage.addNewTask(taskName);
    await expect(todoPage.taskList).toHaveText(taskName);
    await expect(todoPage.taskList).toHaveCount(1);

    // Позначаємо завдання як виконане
    await todoPage.markTaskAsCompleted(taskName);
    const completedTask = todoPage.getTaskByName(taskName).locator(".panel-icon:not(.destroy)");
    await expect(completedTask).toHaveClass(/has-text-success/);  //  дозволяє гнучко шукати, навіть якщо є інші класи одночасно

    // Видаляємо завдання
    await todoPage.removeTask(taskName);
    await expect(todoPage.taskList).toHaveText('No tasks found!');
  });
});

test("Test Case 03 - Multiple Task Operations", async ({ page }) => {
  
  const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

  // Додаємо всі завдання
  for (const task of tasks) {
    await todoPage.addNewTask(task);
  }

  // Перевірка, що всі завдання додано
 
    await expect(todoPage.taskList).toContainText(tasks);
  

  // Позначаємо всі завдання як виконані
  for (const task of tasks) {
    await todoPage.markTaskAsCompleted(task);
  }

  // Клікаємо кнопку "Clear completed tasks"
  await todoPage.clickClearTasks();

  // Перевірка, що список порожній
  await expect(todoPage.taskList).toHaveText('No tasks found!');
});
test("Test Case 04 - Search and Filter Functionality in todo App", async ({ page }) => {
  
  const taskCount = 5;

  // Додаємо кілька завдань і отримуємо їх список
  const tasks = await todoPage.addMultipleTasksAndReturn(taskCount);

  // Перевіряємо, що всі завдання з’явилися у списку
  for (const task of tasks) {
    await expect(todoPage.taskList).toContainText(task);
  }

  // Пошук по ключовому слову (Task 1)
  await todoPage.searchForTodoItem('Task 1');

  // Перевірка, що залишилось тільки одне завдання в списку
  await expect(todoPage.taskList).toHaveText('Task 1');
  await expect(todoPage.taskList).toHaveCount(1);
});

test("Test Case 05 - Task Validation and Error Handling", async ({ page }) => {
  
  // Перевірка додавання пустого завдання
  await todoPage.addNewTask("");
  await expect(todoPage.taskList).toHaveText('No tasks found!');

  // Перевірка додавання завдання, що перевищує 30 символів
  const longTask = 'This is a task with more than 30 characters';
  await todoPage.addNewTask(longTask);
  await expect(todoPage.errorMessage).toHaveText('Error: Todo cannot be more than 30 characters!');

  // Перевірка успішного додавання валідного завдання
  const taskName = 'Task 1';
  await todoPage.addNewTask(taskName);
  await expect(todoPage.taskList).toHaveText(taskName);
  await expect(todoPage.taskList).toHaveCount(1);

  // Перевірка дублювання завдання
  await todoPage.addNewTask(taskName);
  await expect(todoPage.errorMessage).toHaveText(`Error: You already have ${taskName} in your todo list.`);
});



});
