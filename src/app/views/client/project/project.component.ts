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
import { DomSanitizer } from '@angular/platform-browser';
declare let $: any;
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
  isAdd: boolean;
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
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.createdBy = JSON.parse(localStorage.getItem('user')).User.ID;
    $('#overlay').fadeIn();
    this.route.data.subscribe(data => {
      $('#overlay').fadeOut();
      this.projects = data.projects.result;
      this.pagination = data.projects.pagination;
      // console.log('getProjects: ', this.pagination);
    });
    // console.log('Data: ', this.projects);
  }
  open(content) {
    this.isAdd = true;
    this.modalRef = this.modalService.open(content);
  }
  openEditProject(content) {
    this.isAdd = true;
    this.modalRef = this.modalService.open(content);
  }
  close() {
    this.isAdd = true;
    this.modalRef.close();
  }
  load() {
    $('#overlay').fadeIn();
    this.projectService
      .getProjects(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (res: PaginatedResult<Project[]>) => {
          this.projects = res.result;
          this.pagination = res.pagination;
          $('#overlay').fadeOut();
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  edit(content, item) {
    this.titleModal = 'Edit project';
    this.id = item.ID;
    this.name = item.Name;
    this.openEditProject(content);
  }
  onChangeSwitch(id) {
   this.onOff(id);
  }
  defaultImage() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJYAA
      ACWBAMAAADOL2zRAAAAG1BMVEVsdX3////Hy86jqK1+ho2Ql521ur7a3N7s7e5Yhi
      PTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtH
      OTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJ
      J0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvF
      IXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOy
      qPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP
      2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==`);
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  update() {
    const project = {
      ID : this.id,
      Name : this.name
    };
    // console.log(project);
    this.projectService.update(project as Project).subscribe(res => {
      this.alertify.success('Update Successfully!');
      this.load();
      this.close();
    });
  }
  create() {
    this.projectService.create({ Name: this.name }).subscribe(res => {
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
  refresh() {
    this.text = '';// sao may chay lag vay meo biet sao cpu 100%
    this.load();
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
            // console.log('Search: ', this.projects);
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
