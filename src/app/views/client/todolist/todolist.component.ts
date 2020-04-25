import { Component, OnInit, OnChanges, ViewChild, DoCheck, Input } from '@angular/core';
import { PageService, ToolbarItems, TreeGridComponent, EditSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-treegrid';

import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { ListTaskProjectService } from 'src/app/_core/_service/list-task-project.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-angular-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { ProjectDetailService } from 'src/app/_core/_service/projectDetail.service';
import { Task } from 'src/app/_core/_model/Task';
import { AddSubTaskComponent } from '../project-detail/list-task-project/add-sub-task/add-sub-task.component';
import { TodolistService } from 'src/app/_core/_service/todolist.service';
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { JobType, PeriodType } from 'src/app/_core/enum/task.enum';
import { CommentComponent } from '../modals/comment/comment.component';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { IHeader } from 'src/app/_core/_model/header.interface';
import { RoutineService } from 'src/app/_core/_service/routine.service';
import { DragScrollComponent } from 'ngx-drag-scroll';
declare let $: any;
@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  @Input() Id: number;
  @Input() Users: [];
  taskId: 0;
  // tslint:disable-next-line:ban-types
  public contextMenuItems: Object;
  public toolbarOptions: any[];
  public filterSettings: FilterSettingsModel;
  public editSettings: EditSettingsModel;
  private modalRef: NgbModalRef;
  constructor(
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private addTaskService: AddTaskService,
    private listTaskProjectService: ListTaskProjectService,
    private projectDetailService: ProjectDetailService,
    private todolistSerivce: TodolistService,
    private headerService: HeaderService,
    private routineService: RoutineService,
    private router: Router,
    private alertify: AlertifyService) {
  }
  srcTutorial: string;
  sortSettings: object;
  tutorialName: string;
  parentId: number;
  public formatOption = { type: 'dateTime', format: 'dd MMM, yyyy hh:mm:ss a' };
  search: string;
  public data: object;
  projectID: number;
  public pageSetting: object;
  searchSettings: object;
  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent;
  @ViewChild('nav', { read: DragScrollComponent, static: true }) ds: DragScrollComponent;
  public dueDateAccessor = (field: Date, data: { Entity: {DueDate: Date} }, column: object): Date => {
    return new Date(data.Entity.DueDate);
  }
  ngOnInit(): void {
    this.optionGridTree();
    this.resolver();
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
  notification() {
    this.headerService.currentMessage
      .subscribe((arg: IHeader) => {
        console.log('notification ', arg);
        if (arg?.router?.toLowerCase() === 'todolist') {
          this.search = arg.message;
        }
      });
  }
  resolver() {
    $('#overlay').fadeIn();
    this.route.data.subscribe(data => {
      this.data = data.todolist;
      $('#overlay').fadeOut();
      this.onRouteChange();
    });
  }
  optionGridTree() {
    this.searchSettings = {
      hierarchyMode: 'Parent',
      fields: ['JobName'],
      operator: 'contains',
      key: '',
      ignoreCase: true
    };
    this.filterSettings = { type: 'CheckBox' };
    this.sortSettings = { columns: [{ field: 'Entity.DueDate', direction: 'Ascending' }] };
    this.toolbarOptions = [
      'Search',
      'ExpandAll',
      'CollapseAll',
      'ExcelExport',
      'Print',
      { text: 'All columns', tooltipText: 'Show all columns', prefixIcon: 'e-add', id: 'AllColumns' },
      { text: 'Default columns', tooltipText: 'Show default columns', prefixIcon: 'e-add', id: 'DefaultColumns' },
    ];
    this.editSettings = { allowAdding: true, mode: 'Row' };
    this.pageSetting = { pageCount: 2, pageSizes: true };
    this.contextMenuItems = [
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
      },
      {
        text: 'Watch Video',
        iconCss: ' e-icons e-add',
        target: '.e-content',
        id: 'WatchVideo'
      }
    ];
  }
  showAllColumnsTreegrid() {
    const hide = ['Follow', 'From', 'Task Name',
      'Project Name', 'Created Date Time', 'Finished DateTime',
      'PIC', 'Status', 'Deputy', 'Watch Video', 'Period Type'];
    for (const item of hide) {
      this.treeGridObj.showColumns([item, 'Ship Name']);
    }
  }
  defaultColumnsTreegrid() {
    const hide = ['Follow', 'From', 'Watch Video', 'Period Type', 'Deputy'];
    for (const item of hide) {
      this.treeGridObj.hideColumns([item, 'Ship Name']);
    }
  }
  toolbarClick(args: any): void {
    console.log(args.item.text);
    switch (args.item.text) {
      case 'PDF Export':
        this.treeGridObj.pdfExport({ hierarchyExportMode: 'All' });
        break;
      case 'Excel Export':
        this.treeGridObj.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'All columns':
        this.showAllColumnsTreegrid();
        break;
      case 'Default columns':
        this.defaultColumnsTreegrid();
        break;
    }
  }
  sortProject() {
    this.todolistSerivce.sortProject().subscribe((res) => {
      console.log('sortProject: ', res);
      this.data = res;
    });
  }
  sortRoutine() {
    this.todolistSerivce.sortRoutine().subscribe((res) => {
      console.log('sortRoutine: ', res);
      this.data = res;
    });
  }
  sortAbnormal() {
    this.todolistSerivce.sortAbnormal().subscribe((res) => {
      console.log('sortAbnormal: ', res);
      this.data = res;
    });
  }
  sortHigh() {
    this.todolistSerivce.sortHigh().subscribe((res) => {
      console.log('sortHigh: ', res);
      this.data = res;
    });
  }
  sortMedium() {
    this.todolistSerivce.sortMedium().subscribe((res) => {
      console.log('sortMedium: ', res);
      this.data = res;
    });
  }
  sortLow() {
    this.todolistSerivce.sortLow().subscribe((res) => {
      console.log('sortLow: ', res);
      this.data = res;
    });
  }
  sortByAssignedJob() {
    this.todolistSerivce.sortByAssignedJob().subscribe((res) => {
      console.log('sortByAssignedJob: ', res);
      this.data = res;
    });
  }
  sortByBeAssignedJob() {
    this.todolistSerivce.sortByBeAssignedJob().subscribe((res) => {
      console.log('sortByBeAssignedJob: ', res);
      this.data = res;
    });
  }
  all() {
    this.getListTree();
    this.search = '';
    this.treeGridObj.search('');
    console.log(this.router.url.split('?')[0]);
    this.router.navigate(['/todolist']);
  }
  getListTree() {
    $('#overlay').fadeIn();
    this.todolistSerivce.getTasks().subscribe((res) => {
      console.log('getTasks: ', res);
      $('#overlay').fadeOut();
      this.data = res;
    });
  }
  create(): void {
    this.getListTree();
    console.log('create: ');
  }
  done() {
    if (this.taskId > 0) {
      this.projectDetailService.done(this.taskId).subscribe((res: any) => {
        console.log('DOne: ', res);
        if (res.status) {
          this.alertify.success(res.message);
          this.getListTree();
        } else {
          this.alertify.error(res.message, true);
        }
      });
    }
  }
  follow(id) {
    this.routineService.follow(id).subscribe(res => {
      this.alertify.success('You have already followd this one!');
      this.getListTree();
    });
  }
  recordDoubleClick(agrs?: any) {
    this.openCommentModal(agrs);
  }
  openCommentModal(args) {
    const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
    modalRef.componentInstance.title = args.rowData.Entity.JobName;
    modalRef.componentInstance.taskID = args.rowData.Entity.ID;
    modalRef.result.then((result) => {
      console.log('openCommentModal From Todolist', result);
    }, (reason) => {
    });
  }
  openWatchTutorialWatchModal() {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = this.srcTutorial;
    modalRef.componentInstance.name = this.tutorialName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal From Todolist', result);
    }, (reason) => {
    });
  }
  openWatchTutorialWatchModalByButton(data) {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = data.VideoLink;
    modalRef.componentInstance.name = data.JobName;
    modalRef.result.then((result) => {
      console.log('openWatchTutorialWatchModal From Todolist', result);
    }, (reason) => {
    });
  }
  contextMenuOpen(arg?: any): void {
    console.log('contextMenuOpen: ', arg);
    let data = arg.rowInfo.rowData.Entity;
    if (data.VideoStatus) {
      document
        .querySelectorAll('li#WatchVideo')[0]
        .setAttribute('style', 'display: block;');
    } else {
      document
        .querySelectorAll('li#WatchVideo')[0]
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
  }
  dataBound($event) {
    this.defaultColumnsTreegrid();
  }
  contextMenuClick(args?: any): void {
    console.log('contextMenuClick', args);
    const data = args.rowInfo.rowData.Entity;
    console.log('contextMenuClickdata', data);

    this.taskId = data.ID;
    switch (args.item.id) {
      case 'Done':
        this.done();
        break;
      case 'Follow':
        this.follow(data.ID);
        break;
      case 'WatchVideo':
        this.openWatchTutorialWatchModal();
        break;
    }
  }
  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  moveTo(index) {
    this.ds.moveTo(index);
  }
  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
  periodText(enumVal) {
    return this.getEnumKeyByEnumValue(PeriodType, Number(enumVal));
  }
  // ngAfterViewInit() {
  //   // Starting ngx-drag-scroll from specified index(3)
  //   setTimeout(() => {
  //     this.ds.moveTo(0);
  //   }, 0);
  // }
}
