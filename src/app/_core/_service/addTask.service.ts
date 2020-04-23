import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JobType } from '../enum/task.enum';
@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  messageSource = new BehaviorSubject<JobType>(null);
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  // method này để change source message
  changeMessage(message: JobType) {
    this.messageSource.next(message);
  }
}
