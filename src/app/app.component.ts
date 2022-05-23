import { Component } from '@angular/core';
import { Remult, ErrorInfo } from 'remult';
import { Task } from '../shared/Task';
import { TasksController } from '../shared/TasksController';
import { AuthService } from './services/auth.service';
import { AuthController } from 'src/shared/AuthController';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'remult-angular-todo';
  hideCompleted = false;
  username = '';
  taskRepo = this.remult.repo(Task);
  tasks: (Task & { error?: ErrorInfo<Task> })[] = [];

  constructor(public remult: Remult, private auth: AuthService) { }

  ngOnInit() {
    this.fetchTasks();
  }

  async fetchTasks() {
    if (!this.taskRepo.metadata.apiReadAllowed)
      return;
    this.tasks = await this.taskRepo.find({
      orderBy: { completed: "asc" },
      where: { completed: this.hideCompleted ? false : undefined }
    });
  }

  async saveTask(task: (Task & { error?: ErrorInfo<Task> })) {
    try {
      const savedTask = await this.taskRepo.save(task);
      this.tasks = this.tasks.map(t => t === task ? savedTask : t);
    } catch (error: any) {
      alert(error.message);
      task.error = error;
    }
  }

  addTask() {
    this.tasks.push(new Task());
  }

  async deleteTask(task: Task) {
    await this.taskRepo.delete(task);
    this.tasks = this.tasks.filter(t => t !== task);
  }

  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.fetchTasks()
  };

  async signIn() {
    try {
       this.auth.setAuthToken(await AuthController.signIn(this.username));
       this.fetchTasks();
    } catch (error: any) {
       alert(error.message);
    }
 }
 
 signOut() {
    this.auth.setAuthToken(null);
    this.tasks = [];
 }

}
