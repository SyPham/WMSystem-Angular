import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
  public deadline: string;
  public duedatedaily: string;
  public duedateweekly: string;
  public duedatemonthly: string;
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
    private jobtypeService: JobTypeService,
    private calendarService: CalendarsService,
    private alertify: AlertifyService,
    private projectDetailService: ProjectDetailService,
    private routineService: RoutineService) { }

  ngOnInit() {
    this.jobtypeService.currentMessage.subscribe(res => {
      console.log('Add-Task-Modal: ', res);
      if (res === JobType.Routine) {
       this.checkRoutine();
       } else if (res === JobType.Abnormal) {
       this.checkAbnormal();
       }
    });
    this.getBeAssigned();
    this.getFromWho();
    this.checkCurrentQuarter();
    let ls = JSON.parse(localStorage.getItem('user'));
    this.who = ls['User']['ID'] as number;
  }
  checkAbnormal() {
    this.periodtype = PeriodType.SpecificDay;
    this.period = [
       'DueDate'
      ];
    this.selectedPeriodMain = 'DueDate';
    this.changeStatus(true, true, true, false);
    console.log('Open add Modal from Abnormal');
    this.jobtype = JobType.Abnormal;
    if (this.edit !== undefined) {
      console.log('Edit Modal Abnormal: ', this.edit);
      this.loadEdit(this.edit);
    } else {
      this.changeStatus(true, true, true, false);
    }
  }
  checkRoutine() {
    console.log('Open add Modal from Routine');
    this.period = [
      'Daily',
      'Weekly',
      'Monthly',
      'Quarterly',
      'Yearly'
    ];
    this.selectedPeriodMain = 'Daily';
    this.periodtype = PeriodType.Daily;
    this.jobtype = JobType.Routine;
    if (this.edit !== undefined) {
      console.log('Edit Modal Routine: ', this.edit);
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
          this.periodtype = PeriodType.Daily;
          break;
        case 2:
          this.selectedPeriodMain = 'Weekly';
          this.weekday = edit._DueDateWeekly;
          this.monthSelected =  new Date(edit._DateOfWeekly).getMonth() + 1;
          this.duedateweekly = edit._DateOfWeekly;
          this.periodtype = PeriodType.Weekly;
          this.changeStatus(true, false, true);
          break;
        case 3:
          this.selectedPeriodMain = 'Monthly';
          this.duedatemonthly = edit._DueDateMonthly;
          this.periodtype = PeriodType.Monthly;
          this.changeStatus(true, true, true, true, true, false);
          break;
        case 4:
          this.selectedPeriodMain = 'Quarterly';
          if (this.duedatequarterly.length > 0) {
            let date = this.duedatequarterly.split(',')[1].trim();
            let quarter = this.duedatequarterly.split(',')[0].trim();
            this.quarterlySelected = quarter;
            this.duedatequarterly = date + ', ' + new Date().getFullYear();
          }
          this.changeStatus(true, true, true, true, false);
          this.clearPeriod(false, false, false, true, false, false);
          this.periodtype = PeriodType.Quarterly;

          break;
        case 5:
          this.selectedPeriodMain = 'Yearly';
          this.changeStatus(true, true, false);
          this.periodtype = PeriodType.Yearly;
          break;
        case 6:
          this.selectedPeriodMain = 'DueDate';
          this.periodtype = PeriodType.SpecificDay;
          this.changeStatus(true, true, true, false);
          break;
      }
    }
  }
  createTask() {
    if (this.checkValidation()) {
      let beAsigned: any;
      this.pic = this.pic || 0;
      if (this.pic === 0) {
        beAsigned = [];
      } else {
        beAsigned = this.pic;
      }
      if (this.periodtype === PeriodType.Quarterly) {
        let date = this.calendarService.toFormatDate(this.duedatequarterly, false);
        this.duedatequarterly = this.quarterlySelected + ', ' + date;
      }

      const task = new Task().createNewTask(this.Id,
        this.jobname,
        beAsigned,
        this.who,
        0,
        this.deadline,
        this.duedatedaily,
        this.duedateweekly,
        this.duedatemonthly?.substr(0, this.duedatemonthly?.length - 2),
        this.duedatequarterly,
        this.calendarService.toFormatDate(this.duedateyearly, true),
        false,
        this.priority,
        this.parentId,
        this.periodtype,
        0,
        this.jobtype,
        '',
        this.deputies,
        this.ocid);
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
    });
  }

  checkCurrentQuarter() {
    let index = this.calendarService.getQuarter(new Date());
    switch (this.QUARTERLY[index - 1]) {
      case this.QUARTERLY[0]:
         this.max = new Date(new Date().getFullYear(), 3, 0);
         this.min = new Date(new Date().getFullYear(), 1 - 1, 1);
         break;
      case this.QUARTERLY[1]:
        this.max = new Date(new Date().getFullYear(), 6, 0);
        this.min = new Date(new Date().getFullYear(), 4 - 1, 1);
        break;
      case this.QUARTERLY[2]:
        this.max = new Date(new Date().getFullYear(), 9, 0);
        this.min = new Date(new Date().getFullYear(), 7 - 1, 1);
        break;
       case this.QUARTERLY[3]:
        this.max = new Date(new Date().getFullYear(), 12, 0);
        this.min = new Date(new Date().getFullYear(), 10 - 1, 1);
        break;
    }
    this.periodtype = PeriodType.Quarterly;
  }
  onChangeMonthly(arg?) {
    this.periodtype = PeriodType.Monthly;
  }
  onChangeQuarterly(arg?) {
    this.quarterlySelected = arg?.value;
    switch (arg.value) {
      case this.QUARTERLY[0]:
        this.max = new Date(new Date().getFullYear(), 3, 0);
        this.min = new Date(new Date().getFullYear(), 1 - 1, 1);
        break;
     case this.QUARTERLY[1]:
       this.max = new Date(new Date().getFullYear(), 6, 0);
       this.min = new Date(new Date().getFullYear(), 4 - 1, 1);
       break;
     case this.QUARTERLY[2]:
       this.max = new Date(new Date().getFullYear(), 9, 0);
       this.min = new Date(new Date().getFullYear(), 7 - 1, 1);
       break;
      case this.QUARTERLY[3]:
       this.max = new Date(new Date().getFullYear(), 12, 0);
       this.min = new Date(new Date().getFullYear(), 10 - 1, 1);
       break;
    }
    this.periodtype = PeriodType.Quarterly;
  }
  onChangeWeekday(args) {
    this.weekday = args.value;
    this.getWeekdaysOfMonth();
  }
  onChangeMonth(args) {
    this.getWeekdaysOfMonth();
  }
  getWeekdaysOfMonth() {
    let newVal = this.monthSelected;
    let w = this.weekday;
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
  change(arg?) {
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
      case 'Monthly':
        this.changeStatus(true, true, true, true, true, false);
        this.clearPeriod(false, false, true, false, false, false);
        this.periodtype = PeriodType.Monthly;
        break;
      case 'Quarterly':
        this.changeStatus(true, true, true, true, false);
        this.clearPeriod(false, false, false, true, false, false);
        this.periodtype = PeriodType.Quarterly;
        break;
      case 'Yearly':
      this.changeStatus(true, true, false);
      this.clearPeriod(false, false, false, false, true, false);
      this.periodtype = PeriodType.Yearly;
      break;
      case 'DueDate':
      this.changeStatus(true, true, true, false);
      this.clearPeriod(false, false, false, false, false, true);
      this.periodtype = PeriodType.SpecificDay;
      break;
    }
  }
  clearPeriod(daily = false, weekly = false, monthly = false, quarterly= false, yearly= false, deadline= false) {
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
          if (this.duedateweekly === undefined) {
            this.alertify.validation('Warning!', 'Please select on weekly!');
            return false;
          }
          break;
        case 'Monthly':
          if (this.duedatemonthly === undefined) {
            this.alertify.validation('Warning!', 'Please select on monthly!');
            return false;
          }
          break;
        case 'Quarterly':
          if (this.duedatequarterly === undefined) {
            this.alertify.validation('Warning!', 'Please select on quarterly!');
            return false;
          }
          break;
        case 'Yearly':
          if (this.duedateyearly === undefined) {
            this.alertify.validation('Warning!', 'Please select on yearly!');
            return false;
          }
          break;
        case 'DueDate':
          if (this.deadline === undefined) {
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
     this.duedateweekly = '';
     this.duedatemonthly = '';
     this.duedatequarterly = '';
     this.duedateyearly = '';
     this.duedatedaily = '';
     this.deadline = '';
     this.priority = 'M';
     this.pic = 0;
     this.jobtypeService.currentMessage.subscribe(res => {
     if (res === JobType.Routine) {
      this.periodtype = PeriodType.Daily;
     } else if (res === JobType.Abnormal) {
      this.changeStatus(true, true, true, false);
      this.periodtype = PeriodType.SpecificDay;
     }
    });
   }
}
