
import { type Locator, type Page } from "@playwright/test";

export class TodoPage {
  readonly page: Page;
  readonly todoAppModal: Locator;
  readonly todoAppHeading: Locator;
  readonly newTodoInput: Locator;
  readonly addButton: Locator;
  readonly searchField: Locator;
  readonly taskList: Locator;
  readonly clearAllTasks: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page;
    this.todoAppModal = page.locator('.panel');
    this.todoAppHeading = this.todoAppModal.locator('.panel-heading');
    this.newTodoInput = page.locator('#input-add');
    this.addButton = page.locator('#add-btn');
    this.searchField = page.locator('#search');
    this.taskList = page.locator('.todo-item');
    this.clearAllTasks = page.locator('#clear')
    this.errorMessage = page.locator('[class="notification is-danger"]')
  }

  async clickAddButton() {
    await this.addButton.click();
  }


  async addNewTask(task: string): Promise<void> {
    await this.newTodoInput.fill(task);
    await this.clickAddButton();
  }

  async searchForTodoItem(todoItem: string) {
  await this.searchField.fill(todoItem)
  }
   getTaskByName(taskName: string) {
    return this.taskList.filter({ hasText: taskName });
  }

  // Позначити завдання як виконане
  async markTaskAsCompleted(taskName: string) {
    await this.getTaskByName(taskName).locator('.toggle').click();
  }

  // Видалити завдання
  async removeTask(taskName: string) {
    await this.getTaskByName(taskName).locator('.destroy').click();
  }

  // Додати кілька завдань та повернути список їхніх назв
async addMultipleTasksAndReturn(count: number) {
    const tasks: string[] = []; // Створюється порожній масив для збереження назв задач
    for (let i = 1; i <= count; i++) { // Цикл від 1 до числа, яке передане в функцію
      const taskName = `Task ${i}`; // Створюється назва задачі, наприклад: Task 1, Task 2 і т.д.
      await this.addNewTask(taskName); // Асинхронно додається нова задача (ймовірно, в інтерфейсі)
      tasks.push(taskName); // Назва задачі додається в масив tasks
    }
    return tasks; // Повертається масив з усіма назвами доданих задач
}


  // Клік по кнопці очищення завершених завдань
  async clickClearTasks() {
    await this.page.locator('#clear-completed').click();
  }
}
