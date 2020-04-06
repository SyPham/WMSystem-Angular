import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../_core/_service/project.service';
import { AlertifyService } from '../../../_core/_service/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Project } from '../../../_core/_model/project';
import { Pagination, PaginatedResult } from '../../../_core/_model/pagination';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ProjectComponent implements OnInit {
  projects: Project[];
  project: Project;
  user = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  text: string;
  name: string = '';
  id: number = 0;
  isAdd: boolean = true;
  titleModal: string = 'Add Project';
  createdBy: number;
  private modalRef: NgbModalRef;

  constructor(
    private projectService: ProjectService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.createdBy = JSON.parse(localStorage.getItem('user')).User.ID;

    this.spinner.show();
    this.route.data.subscribe(data => {
      this.spinner.hide();
      this.projects = data.projects.result;

      this.pagination = data.projects.pagination;
      console.log('getProjects: ', this.pagination);

    });

    console.log('Data: ', this.projects);
  }
  open(content) {
    this.isAdd = true;
    this.modalRef = this.modalService.open(content);
  }
  close() {
    this.isAdd = true;
    this.modalRef.close();
  }
  load() {
    this.spinner.show();
    this.projectService
      .getProjects(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (res: PaginatedResult<Project[]>) => {
          this.projects = res.result;
          this.pagination = res.pagination;
          this.spinner.hide();
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  edit(content, item) {
    this.titleModal = 'Edit project';
    this.isAdd = false;
    this.id = item.ID;
    this.name = item.Name;
    this.open(content);
  }
  onChangeSwitch(id) {
   this.onOff(id);
  }
  save() {
    if (this.isAdd) this.create(this.name);
    else this.update(this.project);
  }
  update(project: Project) {
    project.ID = this.id;
    project.Name = this.name;
    this.projectService.update(project).subscribe(res => {
      this.alertify.success('Update Successfully!');
      this.load();
      this.close();
    });
  }
  create(name: string) {
    this.projectService.create({ Name: name }).subscribe(res => {
      this.alertify.success('Add Successfully!');
      this.load();
      this.close();
    });
  }
  clone(project: Project) {
    this.alertify.confirm(
      'Clone Project',
      'Are you sure you want to clone this ProjectID "' + project.ID + '" ?',
      () => {
        this.projectService.clone(project.ID).subscribe(
          () => {
            this.alertify.success('Project has been cloned');
            this.load();
          },
          error => {
            this.alertify.error('Failed to clone the Project');
          }
        );
      }
    );
  }
  delete(project: Project) {
    this.alertify.confirm(
      'Delete Project',
      'Are you sure you want to delete this ProjectID "' + project.ID + '" ?',
      () => {
        this.projectService.delete(project.ID).subscribe(
          () => {
            this.alertify.success('Project has been deleted');
            this.load();
          },
          error => {
            this.alertify.error('Failed to delete the Project');
          }
        );
      }
    );
  }
  onPageChange($event) {
    this.pagination.currentPage = $event;
    this.load();
  }
  onOff(project: number) {
    this.projectService.onOrOff(project).subscribe(res => {
      this.alertify.success('Add Successfully!');
      this.load();
    });
  }
  search() {
    if (this.text !== '') {
      this.projectService
        .search(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.text
        )
        .subscribe(
          (res: PaginatedResult<Project[]>) => {
            this.projects = res.result;
            this.pagination = res.pagination;
            console.log('Search: ', this.projects);
          },
          error => {
            this.alertify.error(error);
          }
        );
    } else {
      this.load();
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
}
