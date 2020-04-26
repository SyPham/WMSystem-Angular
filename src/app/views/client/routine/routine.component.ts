import { Component, OnInit, ViewChild } from '@angular/core';
import { RoutineService } from 'src/app/_core/_service/routine.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { FilterSettingsModel, PageService, TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { ProjectDetailService } from 'src/app/_core/_service/projectDetail.service';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';
import { Task } from 'src/app/_core/_model/Task';
import { NgxSpinnerService } from 'ngx-spinner';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-angular-inputs';
import { TutorialModalComponent } from './tutorial-modal/tutorial-modal.component';
import { WatchTutorialVideoComponent } from './watch-tutorial-video/watch-tutorial-video.component';
import { JobType, PeriodType } from 'src/app/_core/enum/task.enum';
import { JobTypeService } from 'src/app/_core/_service/jobType.service';
import { CommentComponent } from '../modals/comment/comment.component';
declare let $: any;
@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css'],
  providers: [PageService, NgbModal]
})
export class RoutineComponent implements OnInit {
  @ViewChild('treegridTasks')
  public treeGridObj: TreeGridComponent;
  public ocs: object;
  public srcTutorial: string;
  public taskId: number;
  public showTasks: boolean;
  public parentId: number;
  public toolbarOptions: any[];
  public toolbarOptionsTasks: any[];
  public tasks: object;
  public pageSetting: object;
  public listOCs = JSON.parse(localStorage.getItem('user')).User.ListOCs;
  public ocLevel = JSON.parse(localStorage.getItem('user')).User.OCLevel;
  public isLeader = JSON.parse(localStorage.getItem('user')).User.IsLeader;
  public currentUser = JSON.parse(localStorage.getItem('user')).User.ID;
  ocId: number;
  public contextMenuItems: object;
  public filterSettings: FilterSettingsModel;
  private tutorialName: string;
  searchSettings: object;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private addTaskService: AddTaskService,
    private jobtypeService: JobTypeService,
    private projectDetailService: ProjectDetailService,
    private routineService: RoutineService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.resolver();
    this.optionGridTree();
    this.checkRole();
  }
  optionGridTree() {
    this.filterSettings = { type: 'CheckBox' };
    this.pageSetting = { pageCount: 2, pageSizes: true };
    this.toolbarOptions = [
      'Search',
      'ExpandAll',
      'CollapseAll'
    ];
    this.searchSettings = {
      hierarchyMode: 'Parent',
      fields: ['JobName'],
      operator: 'contains',
      key: '',
      ignoreCase: true
    };
  }
  resolver() {
    // $('#overlay').fadeIn();
    this.route.data.subscribe(data => {
      this.ocs = data.ocs;
      // $('#overlay').fadeOut();
      this.addTaskService.currentMessage.subscribe(res => {
        if (res === JobType.Routine) {
          this.getTasks();
        }
      });
      this.onRouteChange();
    });
  }
  onRouteChange() {
    this.route.data.subscribe(data => {
      const taskname = this.route.snapshot.paramMap.get('taskname');
      this.searchSettings = {
        hierarchyMode: 'None',
        fields: ['JobName'],
        operator: 'contains',
        key: taskname || '',
        ignoreCase: true
      };
    });
  }
  getOCs() {
    this.routineService.getOCs().subscribe(res => this.ocs = res);
  }
  getTasks() {
    if (this.ocId) {
      // $('#overlay').fadeIn();
      this.routineService.getTasks(this.ocId).subscribe(res => {
        // $('#overlay').fadeOut();
        this.tasks = res;
      });
    } else {
      this.alertify.message('Please select on OC!!!', true);
    }
  }
  delete() {
    if (this.taskId > 0) {
      this.alertify.confirm(
        'Delete Routine Task',
        'Are you sure you want to delete this ProjectID "' + this.taskId + '" ?',
        () => {
          this.projectDetailService.delete(this.taskId).subscribe(
            () => {
              this.alertify.success('Project has been deleted');
              this.getTasks();
            },
            error => {
              this.alertify.error('Failed to delete the Project');
            }
          );
        }
      );
    }
  }
  done() {
    if (this.taskId > 0) {
      this.projectDetailService.done(this.taskId).subscribe((res: any) => {
        console.log('DOne: ', res);
        if (res.status) {
          this.alertify.success(res.message);
          this.getTasks();
        } else {
          this.alertify.error(res.message, true);
        }
      });
    }
  }
  follow(id) {
    this.routineService.follow(id).subscribe(res => {
      this.alertify.success('You have already followd this one!');
      this.getTasks();
    });
  }
  checkRole() {
    if (this.ocLevel >= 3 && !this.isLeader) {
      this.toolbarOptionsTasks = [
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print',
        { text: 'All columns', tooltipText: 'Show all columns', prefixIcon: 'e-add', id: 'AllColumns' },
        { text: 'Default columns', tooltipText: 'Show default columns', prefixIcon: 'e-add', id: 'DefaultColumns' },
      ];
      this.contextMenuItems = [
        {
          text: 'Add Tutorial Video',
          iconCss: 'fa fa-plus-square',
          target: '.e-content',
          id: 'Tutorial'
        },
        {
          text: 'Edit Tutorial',
          iconCss: 'fa fa-wrench',
          target: '.e-content',
          id: 'EditTutorial'
        },
        {
          text: 'Watch Video',
          iconCss: 'fa fa-play',
          target: '.e-content',
          id: 'WatchVideo'
        },
        {
          text: 'Finish Task',
          iconCss: 'fa fa-check',
          target: '.e-content',
          id: 'Done'
        },
        {
          text: 'Follow',
          iconCss: ' fa fa-bell',
          target: '.e-content',
          id: 'Follow'
        },
      ];
    } else {
      this.toolbarOptionsTasks = [
        { text: 'Add New', tooltipText: 'Add New', prefixIcon: 'e-add', id: 'CreateNew' },
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print',
        // { text: 'All columns', tooltipText: 'Show all columns', prefixIcon: 'e-add', id: 'AllColumns' },
        // { text: 'Default columns', tooltipText: 'Show default columns', prefixIcon: 'e-add', id: 'DefaultColumns' },
      ];
      this.contextMenuItems = [
        {
          text: 'Add Sub-Task',
          iconCss: ' e-icons e-add',
          target: '.e-content',
          id: 'Add-Sub-Task'
        },
        {
          text: 'Edit',
          iconCss: ' e-icons e-edit',
          target: '.e-content',
          id: 'EditTask'
        },
        {
          text: 'Delete',
          iconCss: ' e-icons e-delete',
          target: '.e-content',
          id: 'DeleteTask'
        },
        {
          text: 'Add Tutorial Video',
          iconCss: 'fa fa-plus-square',
          target: '.e-content',
          id: 'Tutorial'
        },
        {
          text: 'Edit Tutorial',
          iconCss: 'fa fa-wrench',
          target: '.e-content',
          id: 'EditTutorial'
        },
        {
          text: 'Watch Video',
          iconCss: 'fa fa-play',
          target: '.e-content',
          id: 'WatchVideo'
        },
        {
          text: 'Finish Task',
          iconCss: 'fa fa-check',
          target: '.e-content',
          id: 'Done'
        },
        {
          text: 'Follow',
          iconCss: ' fa fa-bell',
          target: '.e-content',
          id: 'Follow'
        },
        {
          text: 'Unfollow',
          iconCss: ' fa fa-bell-slash',
          target: '.e-content',
          id: 'Unfollow'
        }
      ];
    }
  }
  toolbarClick(args: any): void {
    switch (args.item.text) {
      case 'PDF Export':
        this.treeGridObj.pdfExport({ hierarchyExportMode: 'All' });
        break;
      case 'Excel Export':
        this.treeGridObj.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'Add New':
        this.openAddMainTaskModal();
        break;
      case 'All columns':
        this.showAllColumnsTreegrid();
        break;
      case 'Default columns':
        this.defaultColumnsTreegrid();
        break;
    }
  }
  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
  periodText(enumVal) {
    return this.getEnumKeyByEnumValue(PeriodType, Number(enumVal));
  }
  defaultColumnsTreegrid() {
    const show = ['Follow', 'Priority', 'From', 'Task Name',
      'Created Date', 'Finished DateTime',
      'PIC', 'Status', 'Deputy', 'Watch Video', 'Period Type'];
    for (const item of show) {
      this.treeGridObj.showColumns([item, 'Ship Name']);
    }
  }
  showAllColumnsTreegrid() {
    const hide = ['Follow', 'Priority', 'From', 'Status', 'Watch Video', 'Deputy', 'Period Type'];
    for (const item of hide) {
      this.treeGridObj.hideColumns([item, 'Ship Name']);
    }
  }
  dataBound($event) {
    this.defaultColumnsTreegrid();
  }
  contextMenuOpen(arg?: any): void {
    console.log('contextMenuOpen: ', arg);
    let data = arg.rowInfo.rowData.Entity;
    let users = [...data.Deputies, ...data.PICs].concat(data.FromWho.ID);
    console.log(users);
    if (data.VideoStatus) {
      document
        .querySelectorAll('li#WatchVideo')[0]
        .setAttribute('style', 'display: block;');
      document
        .querySelectorAll('li#EditTutorial')[0]
        .setAttribute('style', 'display: block;');
    } else {
      document
        .querySelectorAll('li#WatchVideo')[0]
        .setAttribute('style', 'display: none;');
      document
        .querySelectorAll('li#EditTutorial')[0]
        .setAttribute('style', 'display: none;');
    }
    if (data.Follow === 'Yes') {
      document
        .querySelectorAll('li#Unfollow')[0]
        .setAttribute('style', 'display: block;');
      document
        .querySelectorAll('li#Follow')[0]
        .setAttribute('style', 'display: none;');
    } else {
      document
        .querySelectorAll('li#Follow')[0]
        .setAttribute('style', 'display: block;');
      document
        .querySelectorAll('li#Unfollow')[0]
        .setAttribute('style', 'display: none;');
    }
    if (this.ocLevel >= 3 && !this.isLeader) {
      if (users.includes(this.currentUser)) {
        // document
        //   .querySelectorAll('li#Add-Sub-Task')[0]
        //   .setAttribute('style', 'display: none;');
        // document
        //   .querySelectorAll('li#EditTask')[0]
        //   .setAttribute('style', 'display: none;');
        // document
        //   .querySelectorAll('li#DeleteTask')[0]
        //   .setAttribute('style', 'display: none;');
      } else {
        this.alertify.warning('You are not assign this task!', true);
      }
    }
  }
  contextMenuClick(args?: any): void {
    console.log('contextMenuClick', args);
    const data = args.rowInfo.rowData.Entity;
    console.log('contextMenuClickdata', data);

    this.taskId = data.ID;
    this.tutorialName = data.JobName;
    this.srcTutorial = data.VideoLink;
    switch (args.item.id) {
      case 'Add-Sub-Task':
        this.parentId = data.ID;
        this.openAddSubTaskModal();
        break;
      case 'Tutorial':
        this.openTutorialModal(args);
        break;
      case 'EditTutorial':
        this.openEditTutorialModal(args);
        break;
      case 'WatchVideo':
        this.openWatchTutorialWatchModal();
        break;
      case 'Done':
        this.done();
        break;
      case 'EditTask':
        this.openEditTaskModal(args);
        break;
      case 'DeleteTask':
        this.delete();
        break;
    }
  }
  openAddMainTaskModal() {
    const modalRef = this.modalService.open(AddTaskModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Routine Main Task';
    modalRef.componentInstance.ocid = this.ocId;
    modalRef.result.then((result) => {
      console.log('openAddMainTaskModal', result)
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openAddSubTaskModal() {
    const modalRef = this.modalService.open(AddTaskModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Routine Sub-Task';
    modalRef.componentInstance.ocid = this.ocId;
    modalRef.componentInstance.parentId = this.parentId;
    modalRef.result.then((result) => {
      console.log('openAddSubTaskModal', result)
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openEditTaskModal(args) {
    const modalRef = this.modalService.open(AddTaskModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Edit Routine Task';
    modalRef.componentInstance.edit = this.editTask(args);
    modalRef.result.then((result) => {
      console.log('openEditTaskModal', result);
    }, (reason) => {
      this.parentId = 0;
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openTutorialModal(args) {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Tutorial Routine Task';
    modalRef.componentInstance.taskId = this.taskId;
    modalRef.componentInstance.jobname = args.rowInfo.rowData.Entity.JobName;
    modalRef.result.then((result) => {
      console.log('openTutorialModal', result);
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openEditTutorialModal(args) {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Edit Tutorial Routine Task';
    modalRef.componentInstance.taskId = this.taskId;
    modalRef.componentInstance.tutorialID = args.rowInfo.rowData.Entity.ID;
    modalRef.componentInstance.jobname = args.rowInfo.rowData.Entity.JobName;
    modalRef.result.then((result) => {
      console.log('openEditTutorialModal', result);
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openWatchTutorialWatchModal() {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = this.srcTutorial;
    modalRef.componentInstance.name = this.tutorialName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal', result);
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  openWatchTutorialWatchModalByButton(data) {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = data.VideoLink;
    modalRef.componentInstance.name = data.JobName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal', result);
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Routine);
  }
  recordDoubleClick(agrs?: any) {
    this.openCommentModal(agrs);
  }
  openCommentModal(args) {
    const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
    modalRef.componentInstance.title = args.rowData.Entity.JobName;
    modalRef.componentInstance.taskID = args.rowData.Entity.ID;
    modalRef.componentInstance.task = args.rowData.Entity;
    modalRef.result.then((result) => {
      console.log('openCommentModal From Todolist', result);
    }, (reason) => {
    });
  }
  rowSelected(args?) {
    this.ocId = args.data.key;
    if (this.listOCs.includes(this.ocId)) {
      this.showTasks = true;
    } else {
      this.showTasks = false;
      this.alertify.validation('Warning!', 'You don\'t belong to this department');
    }
    this.getTasks();
  }
  private editTask(args?): Task {
    if ((args || null) === null) {
      return null;
    }
    const data = args.rowInfo.rowData.Entity;
    return new Task()
      .create(
        data.ID,
        data.JobName,
        data.PICs,
        data.FromWho.ID,
        data.ProjectID,
        false,
        data.PriorityID,
        data.ParentID,
        data.periodType,
        data.ProjectID,
        data.JobTypeID,
        data.Deputies,
        data.OCID,
        data.DueDate
      );
  }
}
