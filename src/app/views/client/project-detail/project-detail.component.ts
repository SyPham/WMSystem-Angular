import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Manager,
  Member,
  Detail,
  User
} from '../../../_core/_model/projectDetail';
import { ProjectDetailService } from '../../../_core/_service/projectDetail.service';
import { EmitType } from '@syncfusion/ej2-base';
import {
  NgbModalConfig,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import {
  FilteringEventArgs,
  ChangeEventArgs
} from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { map } from 'rxjs/operators';
import { ListTaskProjectService } from 'src/app/_core/_service/list-task-project.service';



@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  providers: [NgbModalConfig, NgbModal]
})

export class ProjectDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private projectDetailService: ProjectDetailService,
    private listTaskProjectService: ListTaskProjectService,
    private alertify: AlertifyService
  ) {}

  projectId: number;
  manager: Manager = {
    users: null,
    ProjectID: 0
  };
  member: Member = {
    users: null,
    ProjectID: 0
  };
  managerSelected: number[];
  memberSelected: number[];
  memberID: number[];
  managerID: number[];
  managersName: string;
  membersName: string;
  usersData: any;
  fields = { text: 'Username', value: 'ID' };
  waterMark = 'Search or add a tag';
  default = 'Default';
  box = 'Box';
  delimiter = 'Delimiter';
  titleManagerModal = 'Add Manager';
  titleMemberModal = 'Add Member';
  projectName: string;
  private modalRef: NgbModalRef;
  public onFiltering: EmitType<FilteringEventArgs> = (
    e: FilteringEventArgs
  ) => {
    let query: Query = new Query();
    // frame the query based on search string with filter type.
    query =
      e.text !== ''
        ? query.where('Username', 'startswith', e.text, true)
        : query;
    // pass the filter data source, filter query to updateData method.
    e.updateData(this.usersData, query);
  }
  public changeManager: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    // // console.log(e);
    if (e.isInteracted) {
      this.manager.users = e.value as number;
    }
  }
  public changeMember: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    // // console.log(e);
    if (e.isInteracted) {
      this.member.users = e.value as number;
    }
  }
  ngOnInit() {
    this.route.data.subscribe(data => {
      const detail: Detail = data.details;
      const Id = +this.route.snapshot.paramMap.get('id');
      this.manager.ProjectID = Id;
      this.projectId = Id;
      this.member.ProjectID = Id;
      this.projectName = detail.title;
      this.mapManagerSelected(detail.selectedManager);
      this.mapMemberSelected(detail.selectedMember);
      this.getListUsers();
    });
  }
  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }
  close() {
    this.modalRef.dismiss();
  }
  addManager() {
    this.projectDetailService.addManager(this.manager).subscribe(res => {
      this.getUserByProjectID();
      this.alertify.success('Add Manager Successfully!');
      this.close();
    });
  }
  addMember() {
    this.projectDetailService.addMember(this.member).subscribe(res => {
      this.getUserByProjectID();
      this.alertify.success('Add Member Successfully!');
      this.close();
    });
  }

  getListUsers() {
    this.projectDetailService.getListUsers().subscribe(res => {
      this.usersData = res;
      // // console.log('getListUsers: ', this.usersData);
    });
  }
  mapManagerSelected(manager: User[]) {
    this.managerSelected = manager?.map(item => {
      return item.ID;
    });
    this.managersName = manager?.map(item => {
        return item.Username;
      })
      .join(', ');
  }

  mapMemberSelected(member: User[]) {
    this.memberSelected = member?.map(item => {
      return item.ID;
    });
    this.membersName = member?.map(item => {
        return item.Username;
      })
      .join(', ');
  }
  getUserByProjectID() {
    this.projectDetailService
      .getUserByProjectID(this.projectId)
      .subscribe((res: Detail) => {
        // // console.log('getUserByProjectID: ', res);
        this.mapManagerSelected(res.selectedManager);
        this.mapMemberSelected(res.selectedMember);
      });
  }
}
