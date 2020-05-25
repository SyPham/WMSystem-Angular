import { Component, OnInit,OnDestroy, ViewChild, Input } from '@angular/core';
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { TreeGridComponent, FilterSettingsModel, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import { NgbModalRef, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from 'src/app/_core/_service/history.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { CalendarComponent, DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { IHeader } from 'src/app/_core/_model/header.interface';
import { CommentComponent } from '../modals/comment/comment.component';
import { PeriodType } from 'src/app/_core/enum/task.enum';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';
import { Subscription } from 'rxjs';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import * as signalr from 'src/assets/js/signalr';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @ViewChild('ejDateRangePicker')
  public ejDateRangePicker: DateRangePickerComponent;
  @ViewChild('ejDateRangePickerForDueDateTime')
  public ejDateRangePickerForDueDateTime: DateRangePickerComponent;
  @Input() Id: number;
  @Input() Users: [];
  taskId: 0;
  daterange: any[];
  daterangeForDueDateTime: any[];
  subtractDate: Date;
  currentDate: Date;
  public contextMenuItems: object;
  public toolbarOptions: any[];
  public filterSettings: FilterSettingsModel;
  public editSettings: EditSettingsModel;
  private modalRef: NgbModalRef;
  constructor(
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private historyService: HistoryService,
    private calendarsService: CalendarsService,
    private headerService: HeaderService,
    private router: Router,
    private signalrService: SignalrService,
    private alertify: AlertifyService) {
    }
    srcTutorial: string;
    tutorialName: string;
    parentId: number;
    search: string;
    public data: object;
    projectID: number;
    public formatOption = { type: 'dateTime', format: 'dd MMM, yyyy hh:mm:ss a' };
    public pageSetting: object;
    public searchSettings: object;
    public sortSettings: object;
    currentUser = JSON.parse(localStorage.getItem('user')).User.ID;
    subscription: Subscription;
    @ViewChild('treegrid')
    public treeGridObj: TreeGridComponent;
    public modifyDateAccessor = (field: Date, data: { Entity: {ModifyDateTime: Date} }, column: object): Date => {
      return new Date(data.Entity.ModifyDateTime) ;
   }
   public dueDateAccessor = (field: object, data: { Entity: {DueDate: string} }, column: object): string => {
    return new Date(data.Entity.DueDate).toISOString();
  }
    ngOnInit(): void {
      this.optionGridTree();
      this.setCurrentDate();
      this.resolver();
      // this.signalrService.startConnection();

    }
    receiveSignalr() {
      if (signalr.CONNECTION_HUB.state) {
        signalr.CONNECTION_HUB.on('ReceiveMessageForCurd', (user, username) => {
          if (user.indexOf(this.currentUser) > -1) {
            this.getListTree();
          }
        });
      }
    }
    notification() {
      this.subscription = this.headerService.currentMessage
      .subscribe((arg: IHeader) => {
        // console.log('notification ', arg);
        if (arg?.router?.toLowerCase() === 'history') {
          this.search = arg.message;
        }
        const url = arg?.router?.toLowerCase();
        if (url?.includes('history-comment') && this.router.url.includes('history-comment')) {
          const name = url.split('/')[3];
          const id = url.split('/')[2];
          this.openCommentModalForNotification(name, id);
        }
      });
    }
    recordDoubleClick(agrs) {
      this.openCommentModal(agrs);
    }
    getEnumKeyByEnumValue(myEnum, enumValue) {
      let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
      return keys.length > 0 ? keys[0] : null;
    }
    periodText(enumVal) {
     return this.getEnumKeyByEnumValue(PeriodType, Number(enumVal));
    }
    openCommentModalForNotification(name, id) {
      const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
      modalRef.componentInstance.title = name;
      modalRef.componentInstance.taskID = id;
      modalRef.componentInstance.clientRouter = ClientRouter.History;
      modalRef.result.then((result) => {
        // console.log('open Comment Modal From Todolist', result);
      }, (reason) => {
      });
    }
    openCommentModal(args) {
      const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
      modalRef.componentInstance.title = args.rowData.Entity.JobName;
      modalRef.componentInstance.taskID = args.rowData.Entity.ID;
      modalRef.componentInstance.clientRouter = ClientRouter.History;
      modalRef.result.then((result) => {
          // console.log('openCommentModal From Todolist', result );
        }, (reason) => {
        });
    }
    resolver() {
      this.route.data.subscribe(res => {
        this.data = res.histories;
        this.create();
        this.notification();
      });
    }
    setCurrentDate() {
      this.currentDate = new Date();
      this.subtractDate = new Date();
      this.subtractDate.setDate(this.subtractDate.getDate() - 7);
      this.daterange = [this.subtractDate, this.currentDate];
      // this.daterangeForDueDateTime = [this.subtractDate, this.currentDate];
    }

    optionGridTree() {
      this.searchSettings = {
        hierarchyMode: 'Parent',
        fields: ['Entity.JobName'],
        operator: 'contains',
        key: '',
        ignoreCase: true
      };
      this.filterSettings = { type: 'CheckBox' };
      this.sortSettings = { columns: [{ field: 'Entity.FinishedDateTime', direction: 'Decending' }] };
      this.toolbarOptions = [
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print',
        { text: 'All columns', tooltipText: 'Show all columns', prefixIcon: 'e-add', id: 'AllColumns' },
        { text: 'Default columns', tooltipText: 'Show default columns', prefixIcon: 'e-add', id: 'DefaultColumns' }
      ];
      this.pageSetting = { pageCount: 5, pageSizes: true } ;
      this.contextMenuItems = [
          {
            text: 'Watch Video',
            iconCss: ' e-icons e-add',
            target: '.e-content',
            id: 'WatchVideo'
          }
        ];
    }
    toolbarClick(args: any): void {
      // console.log(args.item.text);
      switch (args.item.text) {
        case 'PDF Export':
          this.treeGridObj.pdfExport({hierarchyExportMode: 'All'});
          break;
        case 'Excel Export':
          this.treeGridObj.excelExport({hierarchyExportMode: 'All'});
          break;
          case 'All columns':
          this.showAllColumnsTreegrid();
          break;
          case 'Default columns':
            this.defaultColumnsTreegrid();
            break;
      }
    }
    filterDateRange() {
      let start = this.calendarsService.toFormatDate(this.daterange[0]);
      let end = this.calendarsService.toFormatDate(this.daterange[1]);

      this.historyService.filterDateRange(start, end).subscribe((res) => {
        // console.log('filterDateRange: ', res);
        this.data = res;
      });
    }
    filterDateRangeByDueDateTime() {
      let start = this.calendarsService.toFormatDate(this.daterangeForDueDateTime[0]);
      let end = this.calendarsService.toFormatDate(this.daterangeForDueDateTime[1]);

      this.historyService.filterDateRangeByDueDateTime(start, end).subscribe((res) => {
        // console.log('filterDateRangeByDueDateTime: ', res);
        this.data = res;
      });
    }
    getListTree() {
      this.historyService.getTasks().subscribe((res) => {
        // console.log('getTasks: ', res);
        this.data = res;
      });
    }
    undo(id) {
      this.historyService.undo(id).subscribe((res) => {
        // console.log('undo: ', res);
        if (res) {
          this.alertify.success('You have already undoed this one');
          this.getListTree();
         } else {
          this.alertify.warning('You can\'t undo this one');
          this.getListTree();
         }
      });
    }
    reset() {
      this.search = '';
      this.treeGridObj.search('');
      this.setCurrentDate();
      this.filterDateRange();
    }
    resetForDueDateTime() {
      this.search = '';
      this.treeGridObj.search('');
      this.setCurrentDate();
      this.filterDateRange();
    }
    create() {
      if (this.search) {
        this.treeGridObj.search(this.search);
      }
    }
    cleared(event) {
      // console.log('Cleared');
    }
    onFocus(args: any): void {
      // console.log('onFocus: ', args);
      this.ejDateRangePicker.show();
    }
    onFocusForDueDateTime(args: any): void {
      // console.log('onFocusForDueDateTime: ', args);
      this.ejDateRangePickerForDueDateTime.show();
    }
    showAllColumnsTreegrid() {
      const hide = ['Undo', 'From', 'Task Name',
      'Project Name', 'Created Date Time', 'Finished DateTime',
      'PIC', 'Status', 'Deputy', 'Watch Video', 'Period Type'];
      for (const item of hide) {
        this.treeGridObj.showColumns([item, 'Ship Name']);
      }
    }
    defaultColumnsTreegrid() {
      const hide = ['Undo', 'From', 'Watch Video', 'Period Type'];
      for (const item of hide) {
        this.treeGridObj.hideColumns([item, 'Ship Name']);
      }
    }
    dataBound($event) {
      this.defaultColumnsTreegrid();
    }
    onChangeDateRangepPicker(event) {
     // // console.log('onChangeDateRangepPicker: ', event);
      if (event.value == null) {
        this.ejDateRangePicker.value = [this.subtractDate, new Date()];
        this.filterDateRange();
      } else {
        this.daterange = [];
        this.daterange = event.value;
        this.filterDateRange();
      }
    }
    onChangeDateRangepPickerForDueDateTime(event) {
     // // console.log('onChangeDateRangepPicker: ', event);
      if (event.value == null) {
        this.ejDateRangePicker.value = [this.subtractDate, new Date()];
        this.filterDateRange();
        this.daterangeForDueDateTime = [];
      } else {
        this.daterangeForDueDateTime = [];
        this.daterangeForDueDateTime = event.value;
        this.filterDateRangeByDueDateTime();
      }
    }
    openWatchTutorialWatchModal() {
      const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
      modalRef.componentInstance.src = this.srcTutorial;
      modalRef.componentInstance.name = this.tutorialName;
      modalRef.result.then((result) => {
        // console.log('openWatchTutorialWatchModal From Todolist', result );
      }, (reason) => {
      });
    }
    openWatchTutorialWatchModalByButton(data) {
      const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
      modalRef.componentInstance.src = data.VideoLink;
      modalRef.componentInstance.name = data.JobName;
      modalRef.result.then((result) => {
       // // console.log('openWatchTutorialWatchModal From Todolist', result );
      }, (reason) => {
      });
    }
    contextMenuOpen(arg?: any): void {
      // console.log('contextMenuOpen: ', arg);
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
    }
    contextMenuClick(args?: any): void {
     // // console.log('contextMenuClick', args);
      const data = args.rowInfo.rowData.Entity;
     // // console.log('contextMenuClickdata', data);

      this.taskId = data.ID;
      switch (args.item.id) {
        case 'WatchVideo':
          this.openWatchTutorialWatchModal();
          break;
      }
    }
}
