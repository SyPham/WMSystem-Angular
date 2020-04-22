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
  public format = 'MMM dd, yyyy';
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
  yearly = true;
  duedate = true;
  jobname: string;
  who: number;
  where: number;
  pic: number;
  deadline: string;
  duedatedaily: string;
  duedateweekly: string;
  duedatemonthly: string;
  duedatequarterly: string;
  duedateyearly: string;
  priority = 'M';
  jobtype: JobType;
  selectedPeriodMain: string = 'DueDate';
  periodtype: PeriodType;
  Id: number;
  // end ngModel
  // getlist
  Users: any;
  Who: any;
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
    this.task = new Task();
    this.jobtype = JobType.Project;
    if (this.edit !== undefined) {
      console.log('Edit Modal: ', this.edit);
      this.loadEdit(this.edit);
    } else {
      this.changeStatus(true, true, true, false);
    }
    let ls = JSON.parse(localStorage.getItem('user'));
    this.who = ls['User']['ID'] as number;
  }
  private loadEdit(edit: Task) {
    if (edit !== null) {
      this.Id = edit._ID;
      this.jobname = edit._JobName;
      this.who = edit._FromWhoID;
      this.where = edit._DepartmentID;
      this.duedateweekly = edit._DueDateWeekly;
      this.duedatemonthly = edit._DueDateMonthly;
      this.duedatequarterly = edit._DueDateQuarterly;
      this.duedateyearly = edit._DueDateYearly;
      this.priority = edit._Priority;
      this.pic = edit._PIC;
      this.duedatedaily = edit._DueDateDaily;
      this.deadline = edit._SpecificDate;
      switch (edit._periodtype) {
        case 1:
          this.selectedPeriodMain = 'Daily';
          this.changeStatus(true, true, true, true);
          break;
        case 2:
          this.selectedPeriodMain = 'Weekly';
          this.weekday = edit._DueDateWeekly;
          this.monthSelected =  new Date(edit._DateOfWeekly).getMonth() + 1;
          this.duedateweekly = edit._DateOfWeekly;
          this.changeStatus(true, false, true);
          break;
        case 3:
          this.selectedPeriodMain = 'Monthly';
          break;
        case 4:
          this.selectedPeriodMain = 'Quarterly';
          break;
        case 5:
          this.selectedPeriodMain = 'Yearly';
          this.changeStatus(true, true, false);
          break;
        case 6:
          this.selectedPeriodMain = 'DueDate';
          this.changeStatus(true, true, true, false);
          console.log('Project Edit: .....................', this.deadline)

          break;
      }
    }
  }
  onFocus(args: FocusEventArgs): void {
  }
  changeStatus(daily = true, weekly = true, yearly = true, duedate = true) {
    this.daily = daily;
    this.weekly = weekly;
    this.yearly = yearly;
    this.duedate = duedate;
  }
  onChangeWeekday(args) {
    this.weekday = args.value;
    this.getWeekdaysOfMonth();
  }
  onChangeMonth(args) {
    this.getWeekdaysOfMonth();
  }
  clearPeriod(daily = false, weekly = false, monthly, quarterly= false, yearly= false, deadline= false) {
   if (!weekly) {
    this.duedateweekly = '';
   }
   if (!monthly) {
      this.duedatemonthly = '';
    }
   if (!quarterly) {
      this.duedatequarterly = '';
    }
   if (!yearly) {
    this.duedateyearly = '';
   }
   if (!daily) {
    this.duedatedaily = '';
    }
   if (!deadline) {
    this.deadline = '';
    }
  }
  clearForm() {
    this.Id = 0;
    this.jobname = '';
    this.who = 0;
    this.where = 0;
    this.duedateweekly = '';
    this.duedatemonthly = '';
    this.duedatequarterly = '';
    this.duedateyearly = '';
    this.priority = 'M';
    this.pic = 0;
    this.duedatedaily = '';
    this.deadline = '';
  }
  createTask() {
    let beAsigned: any;
    this.pic = this.pic || 0;
    if (this.pic === 0) {
      beAsigned = [];
    } else {
      beAsigned = this.pic;
    }

    const task = new Task().createNewTask(0,
      this.jobname,
      beAsigned,
      this.who,
      this.where,
      this.deadline,
      this.duedatedaily,
      this.duedateweekly,
      this.duedatemonthly,
      this.duedatequarterly,
      this.calendarService.toFormatDate(this.duedateyearly, true),
      false,
      this.priority,
      this.parentId,
      this.periodtype,
      this.projectID,
      JobType.Project);
    console.log(task);
    if (this.parentId > 0) {
      this.projectDetailService.createSubTask(task).subscribe(res => {
        console.log('createSubTask: ', res);
        this.clearForm();
        this.addTaskService.changeMessage(101);
        this.activeModal.close('createSubTask');
      });
    } else {
      this.projectDetailService.createMainTask(task).subscribe(res => {
        console.log('createMainTask: ', res);
        this.clearForm();
        this.addTaskService.changeMessage(101);
        this.activeModal.close('createMainTask');
      });
    }
  }
  getWeekdaysOfMonth() {
    let newVal = this.monthSelected;
    let w  = this.weekday;
    let indexof = this.weekdays.indexOf(w);
    switch (indexof) {
      case 0:
        this.weekdaysOfMonth = this.calendarService.getMondaysInMonth(newVal);
        break;
      case 1:
        this.weekdaysOfMonth = this.calendarService.getWednesdaysInMonth(newVal);
        break;
      case 2:
        this.weekdaysOfMonth = this.calendarService.getTuesdaysInMonth(newVal);
        break;
      case 3:
        this.weekdaysOfMonth = this.calendarService.getThursdaysInMonth(newVal);
        break;
      case 4:
        this.weekdaysOfMonth = this.calendarService.getFridaysInMonth(newVal);
        break;
      case 5:
        this.weekdaysOfMonth = this.calendarService.getSaturdaysInMonth(newVal);
        break;
    }
  }
  change(arg?){
    console.log('change: ', arg.target.value);
    switch (arg.target.value) {
      case 'reset': this.changeStatus(); break;
      case 'Daily':
      this.changeStatus();
      this.clearPeriod(true, false, false, false, false, false);
      this.duedatedaily = new Date().toISOString();
      this.periodtype = PeriodType.Daily;
      break;
      case 'Weekly':
      this.changeStatus(true, false);
      this.clearPeriod(false, true, false, false, false, false);
      this.periodtype = PeriodType.Weekly;
      break;
      case 'Yearly':
      this.changeStatus(true, true, false);
      this.clearPeriod(false, false, false, false, true, false);
      this.periodtype = PeriodType.Yearly;
      break;
      case 'DueDate':
      this.changeStatus(true, true, true, false);
      this.clearPeriod(false, false, false, false, false, true);
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
      .subscribe((arg: object) => {
        this.Areas = arg['ocs'];
        this.Who = arg['users'];
        console.log('getAreas:', arg)
      });
  }
}
