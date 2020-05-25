import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RoutineService } from 'src/app/_core/_service/routine.service';
import { Tutorial } from 'src/app/_core/_model/tutorial';
import { TutorialService } from 'src/app/_core/_service/tutorial.service';
import { JobType } from 'src/app/_core/enum/task.enum';
import { AddTask } from 'src/app/_core/_model/add.task';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.css']
})
export class TutorialModalComponent implements OnInit {
  @Input() title = '';
  @Input() taskId = 0;
  @Input() jobname = '';
  @Input() tutorialID = 0;
  @Input() parentid = 0;
  @Input() projectid = 0;
  @Input() ocid = 0;
  @Input() jobType: JobType;
  public item: Tutorial;
  public file: any;
  constructor(
    public activeModal: NgbActiveModal,
    private addTaskService: AddTaskService,
    private alertify: AlertifyService,
    private routineService: RoutineService,
    private tutorialService: TutorialService
  ) { }

  ngOnInit() {
    this.file = null;
    this.item = {
      ID: this.tutorialID,
      Name: this.jobname,
      URL: '',
      Path: '',
      Level: 0,
      TaskID: this.taskId,
      ParentID: this.parentid,
      ProjectID: this.projectid,
      HasChildren: false,
      children: []
    };
  }
  checkValidation() {
    if (this.item.Name === '') {
      this.alertify.warning('Please enter tutorial name', true);
      return false;
    } else if (this.file === null) {
      this.alertify.warning('Please upload tutorial video', true);
      return false;
    }
    return true;
  }
  onChange(event) {
    this.file = event.target.files[0];
  }
  clearForm() {
    this.item = {
      ID: 0,
      Name: '',
      URL: '',
      Path: '',
      Level: 0,
      TaskID: this.taskId,
      ParentID: this.parentid,
      ProjectID: this.projectid,
      HasChildren: false,
      children: []
    };
    this.file = null;
  }
  create() {
    if (!this.checkValidation()) {
      return;
    } else {
    if (this.item.ParentID > 0) {
      let formData = new FormData();
      formData.append('UploadedFile', this.file);
      formData.append('UploadedFileName', this.item.Name);
      formData.append('UploadedFileLevel', (this.item.Level + 1).toString());
      formData.append('UploadedFileParentID', this.item.ParentID.toString());
      formData.append('UploadedFilePath', this.item.Path.toString());
      formData.append('UploadedProjectID', this.item.ProjectID.toString());
      formData.append('UploadedTaskID', this.item.TaskID.toString());
      this.tutorialService.create(formData).subscribe(res => {
        if (res) {
          this.alertify.success('Successfully!');
          this.addTaskService.changeMessage(new AddTask(this.jobType, this.ocid));
          this.activeModal.close('createTutorialVideo');
          this.clearForm();
        }
      });
    } else {
        let formData = new FormData();
        formData.append('UploadedFile', this.file);
        formData.append('UploadedFileName', this.item.Name);
        formData.append('UploadedFileParentID', this.item.ParentID.toString());
        formData.append('UploadedFilePath', this.item.Path.toString());
        formData.append('UploadedProjectID', this.item.ProjectID.toString());
        formData.append('UploadedTaskID', this.item.TaskID.toString());
        this.tutorialService.create(formData).subscribe(res => {
          if (res) {
            this.alertify.success('Successfully!');
            this.addTaskService.changeMessage(new AddTask(this.jobType, this.ocid));
            this.clearForm();
            this.activeModal.close('createTutorialVideo');
          }
        });
      }
    }
  }
}
