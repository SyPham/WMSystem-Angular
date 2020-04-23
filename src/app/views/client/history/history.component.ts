import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { TreeGridComponent, FilterSettingsModel, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import { NgbModalRef, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/_core/_service/history.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { CalendarComponent, DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { IHeader } from 'src/app/_core/_model/header.interface';
import { CommentComponent } from '../modals/comment/comment.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @ViewChild('ejDateRangePicker')
  public ejDateRangePicker: DateRangePickerComponent;
  @Input() Id: number;
  @Input() Users: [];
  taskId: 0;
  daterange: any[];
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
    private alertify: AlertifyService) {
    }
    srcTutorial: string;
    tutorialName: string;
    parentId: number;
    search: string;
    public data: object;
    projectID: number;
    public pageSetting: object;
    public searchSettings: object;
    @ViewChild('treegridtask')
    public treeGridObj: TreeGridComponent;
    ngOnInit(): void {
      this.optionGridTree();
      this.setCurrentDate();
      this.resolver();
    }
    notification() {
      this.headerService.currentMessage
      .subscribe((arg: IHeader) => {
        console.log('notification ', arg);
        if (arg?.router?.toLowerCase() === 'history') {
          this.search = arg.message;
        }
      });
    }
    recordDoubleClick(agrs) {
      alert(JSON.stringify(agrs));
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
      this.subtractDate.setDate(this.subtractDate.getDate() - 5);
      this.daterange = [this.subtractDate, this.currentDate];
    }
    optionGridTree() {
      this.filterSettings = { type: 'CheckBox' };
      this.toolbarOptions = [
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'Print'
      ];
      this.pageSetting = { pageCount: 2, pageSizes: true } ;
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
      console.log(args.item.text);
      switch (args.item.text) {
        case 'PDF Export':
          this.treeGridObj.pdfExport({hierarchyExportMode: 'All'});
          break;
        case 'Excel Export':
          this.treeGridObj.excelExport({hierarchyExportMode: 'All'});
          break;
      }
    }
    sortDateRange() {
      let start = this.calendarsService.toFormatDate(this.daterange[0]);
      let end = this.calendarsService.toFormatDate(this.daterange[1]);
      this.historyService.sortDateRange(start, end).subscribe((res) => {
        console.log('sortDateRange: ', res);
        this.data = res;
      });
    }
    getListTree() {
      this.historyService.getTasks().subscribe((res) => {
        console.log('getTasks: ', res);
        this.data = res;
      });
    }
    undo(id) {
      this.historyService.undo(id).subscribe((res) => {
        console.log('undo: ', res);
        if (res) {
          this.alertify.success('You have already undoed this one');
         } else {
          this.alertify.warning('You can\'t undo this one');
         }
      });
    }
    reset() {
      this.search = '';
      this.treeGridObj.search('');
      this.setCurrentDate();
      this. sortDateRange();
    }
    create() {
      if (this.search) {
        this.treeGridObj.search(this.search);
      }
    }
    cleared(event) {
      console.log('Cleared');
    }
    onFocus(args: any): void {
      console.log('onFocus: ', args);
      this.ejDateRangePicker.show();
    }
    onChangeDateRangepPicker(event) {
      console.log('onChangeDateRangepPicker: ', event);
      if (event.value == null) {
        this.ejDateRangePicker.value = [this.subtractDate, new Date()];
        this.sortDateRange();
      } else {
        this.daterange = [];
        this.daterange = event.value;
        this.sortDateRange();
      }
    }
    openWatchTutorialWatchModal() {
      const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
      modalRef.componentInstance.src = this.srcTutorial;
      modalRef.componentInstance.name = this.tutorialName;
      modalRef.result.then((result) => {
        console.log('openWatchTutorialWatchModal From Todolist', result );
      }, (reason) => {
      });
    }
    openWatchTutorialWatchModalByButton(data) {
      const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
      modalRef.componentInstance.src = data.VideoLink;
      modalRef.componentInstance.name = data.JobName;
      modalRef.result.then((result) => {
        console.log('openWatchTutorialWatchModal From Todolist', result );
      }, (reason) => {
      });
    }
    contextMenuOpen(arg?: any): void {
      console.log('contextMenuOpen: ', arg);
      let data = arg.rowInfo.rowData;
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
      console.log('contextMenuClick', args);
      const data = args.rowInfo.rowData;
      console.log('contextMenuClickdata', data);

      this.taskId = data.ID;
      switch (args.item.id) {
        case 'WatchVideo':
          this.openWatchTutorialWatchModal();
          break;
      }
    }
}