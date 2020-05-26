import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/_core/_service/tutorial.service';
import { WatchTutorialVideoComponent } from '../routine/watch-tutorial-video/watch-tutorial-video.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { TutorialModalComponent } from '../routine/tutorial-modal/tutorial-modal.component';
import { Tutorial } from 'src/app/_core/_model/tutorial';
import { ActivatedRoute } from '@angular/router';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { JobType } from 'src/app/_core/enum/task.enum';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  data: Tutorial[];
  public ID: number;
  public toolbarOptions: any[];
  srcTutorial: string;
  tutorialName: string;
  editparams: any = { params: { format: 'n' } };
  editing: any = { allowDeleting: true, allowEditing: true, mode: 'Row' };
  edit: any = {
    ID: 0,
    Name: '',
    URL: '',
    Path: ''
  };
  file: any;
  contextMenuItems = [
    {
      text: 'Add Tutorial Video',
      iconCss: ' e-icons e-add',
      target: '.e-content',
      id: 'Add-Sub-Tutorial'
    },
    {
      text: 'Edit Tutorial Video',
      iconCss: ' e-icons e-edit',
      target: '.e-content',
      id: 'EditTutorial'
    },
    {
      text: 'Delete',
      iconCss: ' e-icons e-delete',
      target: '.e-content',
      id: 'DeleteTutorial'
    }
  ];
  projectId = 0;
  constructor(
   private tutorialService: TutorialService,
   private clipboardService: ClipboardService,
   private alertify: AlertifyService,
   private route: ActivatedRoute,
   private addTaskService: AddTaskService,
   private modalService: NgbModal

  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.projectId = +this.route.snapshot.paramMap.get('projectid');
      this.created();
    });
    this.addTaskService.currentMessage.subscribe(res => {
      if (res.Jobtype === JobType.Tutorial) {
         this.dataSourceChanged();
         this.getTutorials();
      }
    });
  }
  dataSourceChanged() {
    this.getTutorials();
  }
  created() {
    this.getTutorials();
  }
  rowSelected(args) {
    // console.log('rowSelected: ', args);
    // this.srcTutorial = args.data.URL;
    // this.title = args.data.name;
    // this.tutorial = {
    //   id: args.data.id,
    //   name: args.data.name,
    //   level: args.data.level,
    //   url: args.data.url,
    //   path: args.data.path,
    //   parentid: args.data.parentid
    // };
  }
  getTutorials() {
    this.tutorialService.getTutorials(this.projectId)
      .subscribe((arg) => {
        // console.log('getTutorials: ', arg);
        this.data = arg;
      });
  }
  fileProgress(event) {
    this.file = event.target.files[0];
  }

  watchvideo(data) {
    const modalRef = this.modalService.open(WatchTutorialVideoComponent, { size: 'xl' });
    modalRef.componentInstance.src = data.URL;
    modalRef.componentInstance.name = data.Name;
    modalRef.result.then((result) => {
      // console.log('openWatchTutorialWatchModal From Tutorial', result );
    }, (reason) => {
    });
  }
  copy(linkpath) {
    this.clipboardService.copyFromContent(linkpath);
  }
  actionComplete(args) {
    // console.log('actionComplete', args)
    if (args.requestType === 'save') {
      this.edit.ID = args.data.ID;
      this.edit.Name = args.data.Name;
      this.edit.URL = args.data.URL;
      this.edit.Path = args.data.Path;
      this.tutorialService.Edit(this.edit)
        .subscribe(arg => this.alertify.success('Edit Successfully!'));
    }
  }
  open(linkpath) {
    this.alertify.warning('Browser is not allowed to access local resources , Please copy Link Path paste to the Windows Explorer!', true);
  }
  contextMenuClick(args) {
    if (args.item.id === 'EditTutorial') {
      this.openEditTutorialModal(args);
    } else if (args.item.id === 'DeleteTutorial') {
      this.tutorialService.delete(Number(args.rowInfo.rowData.ID));
    } else {
      this.openTutorialModal();
    }
  }
  openMainTutorialModal() {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Tutorial Video From tutorial';
    modalRef.componentInstance.projectid = this.projectId;
    modalRef.componentInstance.jobType = JobType.Tutorial;
    modalRef.result.then((result) => {
      // console.log('openMainTutorialModal', result );
    }, (reason) => {
    });
  }
  openEditTutorialModal(args) {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Edit Tutorial Video';
    modalRef.componentInstance.taskId = 0;
    modalRef.componentInstance.tutorialID = args.rowInfo.rowData.ID;
    modalRef.componentInstance.jobname =  args.rowInfo.rowData.JobName;
    modalRef.componentInstance.jobType = JobType.Tutorial;
    modalRef.result.then((result) => {
      // console.log('openEditTutorialModal', result );
    }, (reason) => {
    });
  }
  openTutorialModal() {
    const modalRef = this.modalService.open(TutorialModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Add Sub Tutorial Video';
    modalRef.componentInstance.taskId = 0;
    modalRef.componentInstance.taskId = 0;
    modalRef.result.then((result) => {
      // console.log('openTutorialModal', result );
    }, (reason) => {
    });
  }
}
