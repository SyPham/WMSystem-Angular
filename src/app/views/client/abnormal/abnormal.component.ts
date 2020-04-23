import { Component, OnInit, ViewChild } from '@angular/core';
import { AbnormalService } from 'src/app/_core/_service/abnormal.service';
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
import { Task } from 'src/app/_core/_model/Task';
import { NgxSpinnerService } from 'ngx-spinner';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-angular-inputs';
import { AddTaskModalComponent } from '../routine/add-task-modal/add-task-modal.component';
import { TutorialModalComponent } from '../routine/tutorial-modal/tutorial-modal.component';
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { JobType } from 'src/app/_core/enum/task.enum';
import { JobTypeService } from 'src/app/_core/_service/jobType.service';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import { CommentComponent } from '../modals/comment/comment.component';
declare let $: any;
@Component({
  selector: 'app-abnormal',
  templateUrl: './abnormal.component.html',
  styleUrls: ['./abnormal.component.css'],
  providers: [ PageService , NgbModal]
})
export class AbnormalComponent implements OnInit {

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
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private addTaskService: AddTaskService,
    private jobtypeService: JobTypeService,
    private projectDetailService: ProjectDetailService,
    private abnormalService: AbnormalService,
    private alertify: AlertifyService,
    private signalr: SignalrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.signalr.startConnection();
    this.resolver();
    this.filterSettings = { type: 'CheckBox' };
    this.pageSetting = { pageCount: 2, pageSizes: true } ;
    this.toolbarOptions = [
      'Search',
      'ExpandAll',
      'CollapseAll'
    ];
    this.checkRole();
  }
  resolver() {
    $('#overlay').fadeIn();
    this.route.data.subscribe(data => {
      $('#overlay').fadeOut();
      this.ocs = data.ocs;
      this.addTaskService.currentMessage.subscribe(res => {
        if (res === 101) {
           this.getTasks();
        }
      });
    });
  }
  getOCs() {
    this.abnormalService.getOCs().subscribe(res => this.ocs = res);
  }
  getTasks() {
    $('#overlay').fadeIn();
    this.abnormalService.getTasks(this.ocId).subscribe(res => {
      this.tasks = res;
      $('#overlay').fadeOut();

    });
  }
  delete() {
    if (this.taskId > 0) {
      this.alertify.confirm(
        'Delete Abnormal Task',
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
      this.projectDetailService.done(this.taskId).subscribe(res => {
        console.log('DOne: ', res);
        if (res) {
          this.alertify.success('You have already finished this one!');
          this.getTasks();
        } else {
          this.alertify.error('Please finish all sub-tasks!');
        }
      });
    }
  }
  follow(id) {
    this.abnormalService.follow(id).subscribe(res => {
      this.alertify.success('You have already followd this one!');
      this.getTasks();
    } );
  }
  checkRole() {
    if (this.ocLevel >= 3 && !this.isLeader) {
      this.toolbarOptionsTasks = [
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print'
      ];
      this.contextMenuItems = [
        {
          text: 'Finish Task',
          iconCss: ' e-icons e-edit',
          target: '.e-content',
          id: 'Done'
        },
        {
          text: 'Add Tutorial Video',
          iconCss: 'fa fa-plus-square-o',
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
          iconCss: ' e-icons e-add',
          target: '.e-content',
          id: 'WatchVideo'
        },
        {
          text: 'Follow',
          iconCss: ' fa fa-bell',
          target: '.e-content',
          id: 'Follow'
        }
      ];
    } else {
      this.toolbarOptionsTasks = [
        { text: 'Add New', tooltipText: 'Add New', prefixIcon: 'e-add', id: 'CreateNew' },
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print'
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
        }
      ];
    }
  }
  toolbarClick(args: any): void {
    switch (args.item.text) {
      case 'PDF Export':
        this.treeGridObj.pdfExport({hierarchyExportMode: 'All'});
        break;
      case 'Excel Export':
        this.treeGridObj.excelExport({hierarchyExportMode: 'All'});
        break;
      case 'Add New':
        this.openAddMainTaskModal();
        break;
    }
  }
  contextMenuOpen(arg?: any): void {
    console.log('contextMenuOpen: ', arg);
    let data = arg.rowInfo.rowData;
    let users = [...data.Deputies, ...data.PICs].concat(data.FromWho.ID);
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
    if (this.ocLevel >= 3 && !this.isLeader) {
      if (users.includes(this.currentUser)) {
        document
        .querySelectorAll('li#Add-Sub-Task')[0]
        .setAttribute('style', 'display: none;');
        document
        .querySelectorAll('li#EditTask')[0]
        .setAttribute('style', 'display: none;');
        document
        .querySelectorAll('li#DeleteTask')[0]
        .setAttribute('style', 'display: none;');
      } else {
        this.alertify.warning('You are not assign this task!', true);
      }
    } else {
      }
}
  contextMenuClick(args?: any): void {
    console.log('contextMenuClick', args);
    const data = args.rowInfo.rowData;
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
    modalRef.componentInstance.title = 'Add Abnormal Main Task';
    modalRef.componentInstance.ocid = this.ocId;
    modalRef.result.then((result) => {
      console.log('openAddMainTaskModal', result)
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openAddSubTaskModal() {
    const modalRef = this.modalService.open(AddTaskModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Abnormal Sub-Task';
    modalRef.componentInstance.ocid = this.ocId;
    modalRef.componentInstance.parentId = this.parentId;
    modalRef.result.then((result) => {
      console.log('openAddSubTaskModal', result)
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openEditTaskModal(args) {
    const modalRef = this.modalService.open(AddTaskModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Edit Abnormal Task';
    modalRef.componentInstance.edit = this.editTask(args);
    modalRef.result.then((result) => {
      console.log('openEditTaskModal', result );
    }, (reason) => {
      this.parentId = 0;
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openTutorialModal(args) {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Tutorial Abnormal Task';
    modalRef.componentInstance.taskId = this.taskId;
    modalRef.componentInstance.jobname =  args.rowInfo.rowData.JobName;
    modalRef.result.then((result) => {
      console.log('openTutorialModal', result );
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openEditTutorialModal(args) {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Edit Tutorial Abnormal Task';
    modalRef.componentInstance.taskId = this.taskId;
    modalRef.componentInstance.tutorialID = args.rowInfo.rowData.ID;
    modalRef.componentInstance.jobname =  args.rowInfo.rowData.JobName;
    modalRef.result.then((result) => {
      console.log('openEditTutorialModal', result );
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openWatchTutorialWatchModal() {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = this.srcTutorial;
    modalRef.componentInstance.name = this.tutorialName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal', result );
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  openWatchTutorialWatchModalByButton(data) {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = data.VideoLink;
    modalRef.componentInstance.name = data.JobName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal', result );
    }, (reason) => {
    });
    this.jobtypeService.changeMessage(JobType.Abnormal);
  }
  recordDoubleClick(agrs?: any) {
    this.openCommentModal(agrs);
  }
  openCommentModal(args) {
    const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
    modalRef.componentInstance.title = args.rowData.JobName;
    modalRef.componentInstance.taskID = args.rowData.ID;
    modalRef.result.then((result) => {
      console.log('openCommentModal From Todolist', result );
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
    const data = args.rowInfo.rowData;
    return new Task()
    .createNewTask(
      data.ID,
      data.JobName,
      data.PICs,
      data.FromWho.ID,
      data.ProjectID,
      data.SpecificDate,
      data.DueDateDaily,
      data.DueDateWeekly,
      data.DueDateMonthly,
      data.DueDateQuarterly,
      data.DueDateYearly,
      false,
      data.PriorityID,
      data.ParentID,
      data.periodType,
      data.ProjectID,
      data.JobTypeID,
      data.DateOfWeekly,
      data.Deputies,
      data.OCID
      );
  }

}