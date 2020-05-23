import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JobType } from '../enum/task.enum';
import { AddTask } from '../_model/add.task';
@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  messageSource = new BehaviorSubject<AddTask>(new AddTask());
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  // method này để change source message
  changeMessage(message: AddTask) {
    this.messageSource.next(message);
  }
}
