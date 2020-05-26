import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeEventArgs, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { ProjectDetailService } from 'src/app/_core/_service/projectDetail.service';
import { Query } from '@syncfusion/ej2-data';
import { CalendarComponent, FocusEventArgs } from '@syncfusion/ej2-angular-calendars';
import { WeekDay, Months } from 'src/app/_core/enum/Calendars.enum';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { Task } from 'src/app/_core/_model/Task';
import { JobType, PeriodType } from 'src/app/_core/enum/task.enum';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { AddTask } from 'src/app/_core/_model/add.task';

@Component({
  selector: 'app-add-sub-task',
  templateUrl: './add-sub-task.component.html',
  styleUrls: ['./add-sub-task.component.css']
})
export class AddSubTaskComponent implements OnInit {
  @ViewChild('default')
  public datepickerObj: CalendarComponent;
  @Input() title;
  @Input() parentId;
  @Input() projectID;
  @Input() edit: Task;
  // config datetimepicker
  fields = { text: 'Username', value: 'ID' };
  fieldsAreas = { text: 'Name', value: 'ID' };
  waterMark = 'Search or add a tag';
  default = 'Default';
  box = 'Box';
  delimiter = 'Delimiter';
  allowEdit = false;
  Areas: any;
  public months = Months;
  public format = 'dd MMM, yyyy hh:mm a';
  weekday: any;
  monthSelected: any;
  userSelected: number;
  weekdaysOfMonth: [];
  public weekdays = Object.values(WeekDay);
  // end config
  // ngModel
  public task: Task;
  daily = true;
  weekly = true;
  monthly = true;
  yearly = true;
  duedate = true;
  jobname: string;
  who: number;
  where: number;
  pic: number;
  deadline: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
  duedatedaily?: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
  duedateweekly?: Date;
  duedatemonthly?: Date;
  duedatequarterly: string;
  duedateyearly: string;
  priority = 'M';
  jobtype: JobType;
  selectedPeriodMain = 'DueDate';
  periodtype: PeriodType = PeriodType.SpecificDate;
  Id: number;
  // end ngModel
  // getlist
  Users: any;
  Who: any;
  public period: string[] ;
  // end getlist

  // event datetimepciker
  public changeBeAssigned: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    console.log(e);
    if (e.isInteracted) {
    }
  }
  public onFiltering: EmitType<FilteringEventArgs> = (
    e: FilteringEventArgs
  ) => {
    let query: Query = new Query();
    // frame the query based on search string with filter type.
    query =
      e.text !== ''
        ? query.where('Username', 'startswith', e.text, true)
        : query;
    // pass the filter data source, filter query to updateData method.
    e.updateData(this.Users, query);
  }
  // end event
  constructor(
    public activeModal: NgbActiveModal,
    private addTaskService: AddTaskService,
    private calendarService: CalendarsService,
    private projectDetailService: ProjectDetailService) { }

  ngOnInit() {
    this.getListUsers();
    this.getAreas();
    // this.task = new Task();
    this.jobtype = JobType.Project;
    if (this.edit !== undefined) {
      console.log('Edit Modal: ', this.edit);
      this.loadEdit(this.edit);
    } else {
      this.changeStatus(true, true, true, false);
    }
    const ls = JSON.parse(localStorage.getItem('user'));
    this.who = ls.User.ID as number;
    this.period = [
      'Daily',
      'Weekly',
      'Monthly',
      'DueDate'
    ];
  }
  private loadEdit(edit: Task) {
    if (edit !== null) {
      this.Id = edit._ID;
      this.jobname = edit._JobName;
      this.who = edit._FromWhoID;
      this.priority = edit._Priority;
      this.periodtype = edit._periodtype;
      this.pic = edit._PIC;
      this.mapPeriodWithDueDate(edit._periodtype, edit);
    }
  }
  mapPeriodWithDueDate(periodType, item: Task) {
    switch (periodType) {
      case PeriodType.Daily:
        this.periodtype = PeriodType.Daily;
        this.selectedPeriodMain = 'Daily';
        this.changeStatus(false, true, true, true);
        this.duedatedaily = new Date(item._DueDate);
        break;
      case PeriodType.Weekly:
        this.periodtype = PeriodType.Weekly;
        this.selectedPeriodMain = 'Weekly';
        this.duedateweekly = new Date(item._DueDate);
        this.changeStatus(true, false, true);
        break;
        case PeriodType.Monthly:
        this.periodtype = PeriodType.Monthly;
        this.selectedPeriodMain = 'Monthly';
        this.duedatemonthly = new Date(item._DueDate);
        this.changeStatus(true, true, false, true);
        break;
      case PeriodType.SpecificDate:
        this.periodtype = PeriodType.SpecificDate;
        this.selectedPeriodMain = 'DueDate';
        this.deadline = new Date(item._DueDate);
        this.changeStatus(true, true, true, false);
        break;
      default:
        break;
    }
  }
  onFocus(args: FocusEventArgs): void {
  }
  changeStatus(daily = true, weekly = true, monthly = true, duedate = true) {
    this.daily = daily;
    this.weekly = weekly;
    this.monthly = monthly;
    this.duedate = duedate;
  }
  clearPeriod(daily = false, weekly = false, monthly = false, deadline= false) {
   if (!weekly) {
    this.duedateweekly = null;
   }
   if (!monthly) {
      this.duedatemonthly = null;
    }
   if (!daily) {
    this.duedatedaily = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
    }
   if (!deadline) {
    this.deadline = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
    }
  }
  clearForm() {
    this.Id = 0;
    this.jobname = '';
    this.who = 0;
    this.where = 0;
    this.duedateweekly = null;
    this.duedatemonthly = null;
    this.priority = 'M';
    this.pic = 0;
    this.duedatedaily = null;
    this.deadline = null;
  }
  mapDueDateWithPeriod(periodType: PeriodType): string {
    let result: string;
    switch (periodType) {
      case PeriodType.Daily:
        this.periodtype = PeriodType.Daily;
        result = this.duedatedaily.toISOString();
        break;
      case PeriodType.Weekly:
        this.periodtype = PeriodType.Weekly;
        result = this.duedateweekly.toISOString();
        break;
      case PeriodType.Monthly:
        this.periodtype = PeriodType.Monthly;
        result = this.duedatemonthly.toISOString();
        break;
      case PeriodType.SpecificDate:
        this.periodtype = PeriodType.SpecificDate;
        result = this.deadline.toISOString();
        break;
      default:
        break;
    }
    return result;
  }
  createTask() {
    let beAsigned: any;
    this.pic = this.pic || 0;
    if (this.pic === 0) {
      beAsigned = [];
    } else {
      beAsigned = this.pic;
    }

    const task = new Task(this.Id,
      this.jobname,
      beAsigned,
      this.who,
      0,
      false,
      this.priority,
      this.parentId,
      this.periodtype,
      this.projectID,
      this.jobtype,
      [],
      0,
      this.mapDueDateWithPeriod(this.periodtype));
    console.log(task);
    if (this.parentId > 0) {
      this.projectDetailService.createSubTask(task).subscribe(res => {
        console.log('createSubTask: ', res);
        this.clearForm();
        this.addTaskService.changeMessage(new AddTask(JobType.Project, 0));
        this.activeModal.close('createSubTask');
      });
    } else {
      this.projectDetailService.createMainTask(task).subscribe(res => {
        console.log('createMainTask: ', res);
        this.clearForm();
        this.addTaskService.changeMessage(new AddTask(JobType.Project, 0));
        this.activeModal.close('createMainTask');
      });
    }
  }
  change(arg?){
    console.log('change: ', arg);
    switch (this.selectedPeriodMain) {
      case 'reset': this.changeStatus(); break;
      case 'Daily':
      this.changeStatus(false);
      this.clearPeriod(true, false, false, false);
      this.duedatedaily  = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
      this.periodtype = PeriodType.Daily;
      break;
      case 'Weekly':
      this.changeStatus(true, false);
      this.clearPeriod(false, true, false, false);
      this.periodtype = PeriodType.Weekly;
      break;
      case 'Monthly':
        this.changeStatus(true, true, false);
        this.clearPeriod(false, false, true, false);
        this.periodtype = PeriodType.Monthly;
        break;
      case 'DueDate':
      this.changeStatus(true, true, true, false);
      this.clearPeriod(false, false, false, true);
      this.periodtype = PeriodType.SpecificDate;
      break;
    }
  }
  getListUsers() {
    this.projectDetailService.getListUsers()
      .subscribe(arg => this.Users = arg);
  }
  getAreas() {
    this.projectDetailService.getAreas()
      .subscribe((arg: any) => {
        this.Areas = arg.ocs;
        this.Who = arg.users;
        console.log('getAreas:', arg);
      });
  }
}
