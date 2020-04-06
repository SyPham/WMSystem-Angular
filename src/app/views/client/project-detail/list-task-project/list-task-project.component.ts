import { Component, OnInit, OnChanges, ViewChild, DoCheck, Input } from '@angular/core';
import { PageService, ToolbarItems, TreeGridComponent, EditSettingsModel, FilterSettingsModel} from '@syncfusion/ej2-angular-treegrid';

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
import { AddSubTaskComponent } from './add-sub-task/add-sub-task.component';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { ProjectDetailService } from 'src/app/_core/_service/projectDetail.service';
import { Task } from 'src/app/_core/_model/Task';
import { CommentComponent } from '../../modals/comment/comment.component';
// tslint:disable-next-line:no-conflicting-lifecycle
@Component({
  selector: 'app-list-task-project',
  templateUrl: './list-task-project.component.html',
  styleUrls: ['./list-task-project.component.css'],
  providers: [ PageService , NgbModal]
})
export class ListTaskProjectComponent implements OnInit {
  @Input() Id: number;
  @Input() Users: [];
  taskId: 0;
  public contextMenuItems: object;
  public toolbarOptions: any[];
  public filterSettings: FilterSettingsModel;
  public editSettings: EditSettingsModel;
  private modalRef: NgbModalRef;
  constructor(
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private addTaskService: AddTaskService,
    private listTaskProjectService: ListTaskProjectService,
    private projectDetailService: ProjectDetailService,
    private alertify: AlertifyService) {
    }
  parentId: number;
  public data: object;
  projectID: number;
  public pageSetting: object;
  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent;
    ngOnInit(): void {
      this.filterSettings = { type: 'CheckBox' };
      this.toolbarOptions = [
        { text: 'Add New', tooltipText: 'Add New', prefixIcon: 'e-add', id: 'CreateNew' },
        'Search',
        'ExpandAll',
        'CollapseAll',
        'ExcelExport',
        'PdfExport',
        'Print'
      ];
      this.editSettings = { allowAdding: true, mode: 'Row'};
      this.addTaskService.currentMessage.subscribe(res => {
        if (res === 101) {
           this.getListTree(this.Id);
        }
      });
      this.projectID = +this.route.snapshot.paramMap.get('id');
      this.pageSetting = { pageCount: 2, pageSizes: true } ;
      this.contextMenuItems = [
          {
            text: 'Add Sub-Task',
            iconCss: ' e-icons e-add',
            target: '.e-content',
            id: 'Add-Sub-Task'
          },
          {
            text: 'Add Remark',
            iconCss: ' e-icons e-add',
            target: '.e-content',
            id: 'Remark'
          },
          {
            text: 'Finish Task',
            iconCss: ' e-icons e-edit',
            target: '.e-content',
            id: 'Done'
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
          }
        ];
    }
    sortHigh() {
      this.listTaskProjectService.sortHigh(this.Id).subscribe((res) => {
        console.log('sortHigh From list task: ', res);
        this.data = res;
      });
    }
    sortMedium() {
      this.listTaskProjectService.sortMedium(this.Id).subscribe((res) => {
        console.log('sortMedium: ', res);
        this.data = res;
      });
    }
    sortLow() {
      this.listTaskProjectService.sortLow(this.Id).subscribe((res) => {
        console.log('sortLow: ', res);
        this.data = res;
      });
    }
    all() {
      this.create();
      this.treeGridObj.search('');
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
        case 'Add New':
          this.openAddMainTaskModal();
          break;
      }
    }
    pushToTutorial() {
      this.router.navigate([`/tutorial/${this.Id}`]);
    }
    getListTree(id) {
      this.listTaskProjectService.getListTree(id).subscribe((res) => {
        console.log('getListTree: ', res);
        this.data = res;
      });
    }
    create(): void {
      this.getListTree(this.Id);
      console.log('create: ');

    }
    delete() {
      if (this.taskId > 0) {
        this.projectDetailService.delete(this.taskId).subscribe(res => {
          this.alertify.success('Delete Successfully!')
          this.getListTree(this.Id);
        });
      }
    }
    done() {
      if (this.taskId > 0) {
        this.projectDetailService.done(this.taskId).subscribe(res => {
          console.log('DOne: ', res)
          if (res) {
            this.alertify.success('You have already finished this one!')
            this.getListTree(this.Id);
          } else {
            this.alertify.error('Please finish all sub-tasks!');
          }
        });
      }
    }
    openAddMainTaskModal() {
      const modalRef = this.modalService.open(AddSubTaskComponent, { size: 'xl' });
      modalRef.componentInstance.title = 'Add Main Task';
      modalRef.componentInstance.Users = this.Users;
      modalRef.componentInstance.parentId = 0;
      modalRef.componentInstance.projectID = this.projectID;
      modalRef.result.then((result) => {
        console.log('openAddMainTaskModal', result )
      }, (reason) => {
        this.parentId = 0;
      });
    }
    openAddSubTaskModal() {
      const modalRef = this.modalService.open(AddSubTaskComponent, { size: 'xl' });
      modalRef.componentInstance.title = 'Add Sub Task';
      modalRef.componentInstance.Users = this.Users;
      modalRef.componentInstance.parentId = this.parentId;
      modalRef.componentInstance.projectID = this.projectID;
      modalRef.result.then((result) => {
        console.log('openAddSubTaskModal', result )
      }, (reason) => {
        this.parentId = 0;
      });
    }
    openEditTaskModal(args) {
      const modalRef = this.modalService.open(AddSubTaskComponent, { size: 'xl' });
      modalRef.componentInstance.title = 'Edit Task';
      modalRef.componentInstance.Users = this.Users;
      modalRef.componentInstance.parentId = this.parentId;
      modalRef.componentInstance.projectID = this.projectID;
      modalRef.componentInstance.edit = this.editTask(args);
      modalRef.result.then((result) => {
        console.log('openEditTaskModal', result )
      }, (reason) => {
        this.parentId = 0;
      });
    }
    private editTask(args?): Task {
      if((args || null) === null) {
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
        data.DateOfWeekly);
    }
    contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
      // let elem: Element = arg.event.target as Element;
      // let row: Element = elem.closest('.e-row');
      // let uid: string = row && row.getAttribute('data-uid');
      // let items: Array<HTMLElement> = [].slice.call(document.querySelectorAll('.e-menu-item'));
      // for (let i: number = 0; i < items.length; i++) {
      //   items[i].setAttribute('style','display: none;');
      // }
      // if (elem.closest('.e-row')) {
      //   if ( isNullOrUndefined(uid) || 
      //     isNullOrUndefined(getValue('hasChildRecords', this.treegrid.grid.getRowObjectFromUID(uid).data))) {
      //     arg.cancel = true;
      //   } else {
      //     let flag: boolean = getValue('expanded', this.treegrid.grid.getRowObjectFromUID(uid).data);
      //     let val: string = flag ? 'none' : 'block';
      //     document.querySelectorAll('li#expandrow')[0].setAttribute('style', 'display: ' + val + ';');
      //     val = !flag ? 'none' : 'block';
      //     document.querySelectorAll('li#collapserow')[0].setAttribute('style', 'display: ' + val + ';');
      //   }
      // } else {
      //   let len = this.treegrid.element.querySelectorAll('.e-treegridexpand').length;
      //   if (len !== 0) {
      //      document.querySelectorAll('li#collapseall')[0].setAttribute('style', 'display: block;');
      //   } else {
      //     document.querySelectorAll('li#expandall')[0].setAttribute('style', 'display: block;');
      //   }
      // }
  }
  contextMenuClick(args?: any): void {
    console.log('contextMenuClick', args);
    const data = args.rowInfo.rowData;
    console.log('contextMenuClickdata', data);

    this.taskId = data.ID;
    switch (args.item.id) {
      case 'Add-Sub-Task':
        this.parentId = data.ID;
        this.openAddSubTaskModal();
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
}
