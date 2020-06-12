import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { Task } from 'src/app/_core/_model/Task';
import { JobType, PeriodType } from 'src/app/_core/enum/task.enum';
import { EmitType } from '@syncfusion/ej2-base';
import { WeekDay, Months, Quarterly, DAYOFMONTH } from 'src/app/_core/enum/Calendars.enum';
import { ChangeEventArgs, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { RoutineService } from 'src/app/_core/_service/routine.service';
import { ProjectDetailService } from 'src/app/_core/_service/projectDetail.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { JobTypeService } from 'src/app/_core/_service/jobType.service';
import { AddTask } from 'src/app/_core/_model/add.task';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.css']
})
export class AddTaskModalComponent implements OnInit {
  @ViewChild('default')
  public datepickerObj: CalendarComponent;
  @Input() title;
  @Input() parentId;
  @Input() edit: Task;
  @Input() ocid: number;

  beAssgined: any;
  fromWho: any;
  beAssigned: any;
  // config datetimepicker
  // public value2: Date = new Date(2019, 5, 1, 22);
  public format2 = 'dd MMM, yyyy hh:mm a';
  public test: any;
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public minDate: Date = new Date(this.fullYear, this.month, 22, 12);
  public maxDate: Date = new Date(this.fullYear, this.month, 25, 17);
  fields = { text: 'Username', value: 'ID' };
  fieldsAreas = { text: 'Name', value: 'ID' };
  waterMark = 'Search or add a tag';
  default = 'Default';
  box = 'Box';
  delimiter = 'Delimiter';
  allowEdit = false;
  Areas: any;
  public months = Months;
  public format = 'dd MMM, yyyy hh:mm:ss a';
  weekday: any;
  monthSelected: any;
  userSelected: number;
  weekdaysOfMonth: [];
  public weekdays = Object.values(WeekDay);
  public QUARTERLY = Quarterly;
  public period: string[];
  public max: Date;
  public min: Date;
  // end config
  public task: Task;
  public daily = true;
  public weekly = true;
  public monthly = true;
  public quarterly = true;
  public yearly = true;
  public duedate = true;
  public jobname: string;
  public who: number;
  public pic: number;
  public deadline: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
  public duedatedaily?: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
  public duedateweekly?: Date;
  public duedatemonthly?: Date;
  public duedatequarterly: string;
  public duedateyearly: string;
  public priority = 'M';
  public jobtype: JobType;
  public selectedPeriodMain: string;
  public periodtype: PeriodType;
  public Id: number;
  public quarterlySelected: string;
  public dateofquarterly: string;
  public deputies: number;
  public dateofmonthly: string;
  public dayofmonth = DAYOFMONTH.map((item, index) => {
    return (index + 1) + item.substring(item.length - 2);
  });
  // getlist
  public Users: any;
  public Who: any;
  // end getlist
  // event datetimepciker
  public changeBeAssigned: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    // console.log(e);
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
    private jobtypeService: JobTypeService,
    private calendarService: CalendarsService,
    private alertify: AlertifyService,
    private projectDetailService: ProjectDetailService,
    private routineService: RoutineService) { }

  ngOnInit() {
    // console.log('load Edit......................', this.edit);
    this.jobtypeService.currentMessage.subscribe(res => {
      // console.log('Add-Task-Modal: ', res);
      if (res === JobType.Routine) {
        this.checkRoutine();
      } else if (res === JobType.Abnormal) {
        this.checkAbnormal();
      }
    });
    this.getBeAssigned();
    this.getFromWho();
    let ls = JSON.parse(localStorage.getItem('user'));
    this.who = ls.User.ID as number;
  }
  checkAbnormal() {
    this.periodtype = PeriodType.SpecificDate;
    this.period = [
      'DueDate'
    ];
    this.selectedPeriodMain = 'DueDate';
    this.changeStatus(true, true, true, false);
    // console.log('Open add Modal from Abnormal');
    this.jobtype = JobType.Abnormal;
    if (this.edit !== undefined) {
      // console.log('Edit Modal Abnormal: ', this.edit);
      this.loadEdit(this.edit);
    } else {
      this.changeStatus(true, true, true, false);
    }
  }
  checkRoutine() {
    // console.log('Open add Modal from Routine');
    this.period = [
      'Daily',
      'Weekly',
      'Monthly'
    ];
    this.selectedPeriodMain = 'Daily';
    this.periodtype = PeriodType.Daily;
    this.jobtype = JobType.Routine;
    if (this.edit !== undefined) {
      // console.log('Edit Modal Routine: ', this.edit);
      this.loadEdit(this.edit);
    } else {
      this.changeStatus(false);
    }
  }
  private loadEdit(edit: Task) {
    if (edit !== null) {
      this.Id = edit._ID;
      this.jobname = edit._JobName;
      this.who = edit._FromWhoID;
      this.deputies = edit._Deputies;
      this.priority = edit._Priority;
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
        this.changeStatus(true, true, true, true, true, false);
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
    // console.log('create Task duedateweekly: ', this.duedateweekly);
    if (this.checkValidation()) {
      let beAsigned: any;
      this.pic = this.pic || 0;
      if (this.pic === 0) {
        beAsigned = [];
      } else {
        beAsigned = this.pic;
      }
      let deputy: any;
      this.deputies = this.deputies || 0;
      if (this.deputies === 0) {
        deputy = [];
      } else {
        deputy = this.deputies;
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
        0,
        this.jobtype,
        deputy,
        this.ocid,
        this.mapDueDateWithPeriod(this.periodtype));
      // console.log(task);
      if (this.parentId > 0) {
        this.projectDetailService.createSubTask(task).subscribe(res => {
          // console.log('createSubTask: ', res);
          this.clearForm();
          if (this.jobtype === JobType.Abnormal){
            this.addTaskService.changeMessage(new AddTask(JobType.Abnormal, this.ocid));
          } else {
            this.addTaskService.changeMessage(new AddTask(JobType.Routine, this.ocid));
          }
          this.activeModal.close('createSubTask');
        });
      } else {
        this.projectDetailService.createMainTask(task).subscribe(res => {
          // console.log('createMainTask: ', res);
          this.clearForm();
          if (this.jobtype === JobType.Abnormal){
            this.addTaskService.changeMessage(new AddTask(JobType.Abnormal, this.ocid));
          } else {
            this.addTaskService.changeMessage(new AddTask(JobType.Routine, this.ocid));
          }
          this.activeModal.close('createMainTask');
        });
      }
    }
  }

  getBeAssigned() {
    this.routineService.getBeAssigned().subscribe(res => {
      this.beAssigned = res;
    });
  }
  changeStatus(daily = true, weekly = true, yearly = true, duedate = true, quarterly = true, monthly = true) {
    this.daily = daily;
    this.weekly = weekly;
    this.yearly = yearly;
    this.duedate = duedate;
    this.quarterly = quarterly;
    this.monthly = monthly;
  }
  getFromWho() {
    this.routineService.getWho().subscribe(res => {
      this.Users = res;
      this.beAssigned = res;
    });
  }
  onChangeMonthly(arg?) {
    this.periodtype = PeriodType.Monthly;
  }
  change(arg?) {
    // console.log('change: ', arg.value);
    switch (this.selectedPeriodMain) {
      case 'reset': this.changeStatus(); break;
      case 'Daily':
        this.changeStatus(false);
        this.clearPeriod(true, false, false, false, false, false);
        this.duedatedaily = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 30);
        this.periodtype = PeriodType.Daily;
        break;
      case 'Weekly':
        this.changeStatus(true, false);
        this.clearPeriod(false, true, false, false, false, false);
        this.periodtype = PeriodType.Weekly;
        break;
      case 'Monthly':
        this.changeStatus(true, true, true, true, true, false);
        this.clearPeriod(false, false, true, false, false, false);
        this.periodtype = PeriodType.Monthly;
        break;
      case 'DueDate':
        this.changeStatus(true, true, true, false);
        this.clearPeriod(false, false, false, false, false, true);
        this.periodtype = PeriodType.SpecificDate;
        break;
    }
  }
  clearPeriod(daily = false, weekly = false, monthly = false, quarterly = false, yearly = false, deadline = false) {
    if (!weekly) {
      this.duedateweekly = null;
    }
    if (!monthly) {
      this.duedatemonthly = null;
    }
    if (!quarterly) {
      this.duedatequarterly = '';
    }
    if (!yearly) {
      this.duedateyearly = '';
    }
    if (!daily) {
      this.duedatedaily = null;
    }
    if (!deadline) {
      this.deadline = null;
    }
  }
  checkValidation() {
    if (this.jobname === undefined) {
      this.alertify.validation('Warning!', 'Please enter the job name!');
      return false;
    } else if (this.who === undefined) {
      this.alertify.validation('Warning!', 'Please select on from!');
      return false;
    } else if (this.selectedPeriodMain !== '') {
      switch (this.selectedPeriodMain) {
        case 'Weekly':
          if (this.duedateweekly === undefined || this.duedateweekly === null) {
            this.alertify.validation('Warning!', 'Please select on weekly!');
            return false;
          }
          break;
        case 'Monthly':
          if (this.duedatemonthly === undefined || this.duedatemonthly === null) {
            this.alertify.validation('Warning!', 'Please select on monthly!');
            return false;
          }
          break;
        case 'DueDate':
          if (this.deadline === undefined || this.deadline === null) {
            this.alertify.validation('Warning!', 'Please select on deadline!');
            return false;
          }
          break;
      }
    }
    return true;
  }
  clearForm() {
    this.Id = 0;
    this.jobname = '';
    this.who = 0;
    this.deputies = 0;
    this.duedateweekly = null;
    this.duedatemonthly = null;
    this.duedatequarterly = '';
    this.duedateyearly = '';
    this.duedatedaily = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
    this.deadline =new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 7, 0);
    this.priority = 'M';
    this.pic = 0;
    this.jobtypeService.currentMessage.subscribe(res => {
      if (res === JobType.Routine) {
        this.periodtype = PeriodType.Daily;
      } else if (res === JobType.Abnormal) {
        this.changeStatus(true, true, true, false);
        this.periodtype = PeriodType.SpecificDate;
      }
    });
  }
}
