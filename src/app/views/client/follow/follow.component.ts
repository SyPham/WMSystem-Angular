import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { TreeGridComponent, FilterSettingsModel, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import { NgbModalRef, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { FollowService } from 'src/app/_core/_service/follow.service';
import { IHeader } from 'src/app/_core/_model/header.interface';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { PeriodType } from 'src/app/_core/enum/task.enum';
import { CommentComponent } from '../modals/comment/comment.component';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';
declare let $: any;
@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  @Input() Id: number;
  @Input() Users: [];
  taskId: 0;
  // tslint:disable-next-line:ban-types
  public contextMenuItems: object;
  public toolbarOptions: any[];
  public filterSettings: FilterSettingsModel;
  public editSettings: EditSettingsModel;
  private modalRef: NgbModalRef;
  constructor(
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private followService: FollowService,
    private headerService: HeaderService,
    private alertify: AlertifyService) {
  }
  srcTutorial: string;
  tutorialName: string;
  parentId: number;
  public data: object;
  projectID: number;
  public pageSetting: object;
  public searchSettings: object;
  search: string;
  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent;
  ngOnInit(): void {
    this.optionGridTree();
    this.resolver();
  }
  notification() {
    this.headerService.currentMessage
      .subscribe((arg: IHeader) => {
        console.log('notification ', arg);
        if (arg?.router?.toLowerCase() === 'follow') {
          this.search = arg.message;
        }
      });
  }
  resolver() {
    $('#overlay').fadeIn();
    this.route.data.subscribe(res => {
      this.data = res.follows;
      $('#overlay').fadeOut();
      this.create();
      this.notification();
    });
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
    this.searchSettings = {
      hierarchyMode: 'Parent',
      fields: ['Entity.JobName'],
      operator: 'contains',
      key: '',
      ignoreCase: true
    };
    this.editSettings = { allowAdding: true, mode: 'Row' };
    this.pageSetting = { pageCount: 5, pageSizes: true };
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
        this.treeGridObj.pdfExport({ hierarchyExportMode: 'All' });
        break;
      case 'Excel Export':
        this.treeGridObj.excelExport({ hierarchyExportMode: 'All' });
        break;
    }
  }
  getListTree() {
    $('#overlay').fadeIn();
    this.followService.getTasks().subscribe((res) => {
      $('#overlay').fadeOut();
      console.log('get follows: ', res);
      this.data = res;
    });
  }
  unfollow(id) {
    this.followService.unfollow(id).subscribe((res) => {
      console.log('unfollow: ', res);
      if (res) {
        this.alertify.success('You have already unfollowed this one');
        this.getListTree();
      } else {
        this.alertify.warning('You can\'t unfollow this one');
      }
    });
  }
  create() {
    if (this.search) {
      this.treeGridObj.search(this.search);
    }
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
  }
  contextMenuClick(args?: any): void {
    console.log('contextMenuClick', args);
    const data = args.rowInfo.rowData.Entity;
    console.log('contextMenuClickdata', data);

    this.taskId = data.ID;
    switch (args.item.id) {
      case 'WatchVideo':
        this.openWatchTutorialWatchModal();
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
   recordDoubleClick(agrs) {
    this.openCommentModal(agrs);
  }
  openCommentModal(args) {
    const modalRef = this.modalService.open(CommentComponent, { size: 'xl' });
    modalRef.componentInstance.title = args.rowData.Entity.JobName;
    modalRef.componentInstance.taskID = args.rowData.Entity.ID;
    modalRef.componentInstance.clientRouter = ClientRouter.Follow;
    modalRef.result.then((result) => {
      console.log('openCommentModal From Todolist', result );
    }, (reason) => {
    });
  }
}
