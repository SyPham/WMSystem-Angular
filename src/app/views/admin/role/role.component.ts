import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/_core/_service/role.service';
import { Pagination } from 'src/app/_core/_model/pagination';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AddRoleComponent } from '../modal/add-role/add-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  public role: any;
  public data: any;
  public text: string;

  pagination: Pagination;
  constructor(
    private roleService: RoleService,
    private alertify: AlertifyService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resolver();
    this.onService();
  }
  onService() {
    this.roleService.currentMessage.subscribe( res => {
      if (res === 200) {
        this.getAll();
      }
    });
  }
  resolver() {
    this.route.data.subscribe(res => {
      console.log('resolver: ', res.roles.result);
      this.data = res.roles.result;
      this.pagination = res.roles.pagination;
    });
  }

  delete(id) {
    this.alertify.confirm(
      'Delete Role',
      'Are you sure you want to delete this RoleID "' + id + '" ?',
      () => {
        this.roleService.delete(id).subscribe( res => {
          this.alertify.success('The Role has been deleted!');
          this.getAll();
        });
      }
    );
  }
  getAll() {
    this.roleService.getRoles(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe( res => {
      console.log('Users: ', res.result);
      this.data = res.result;
      this.pagination = res.pagination;
    });
  }
  search() {
    this.roleService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text).subscribe( res => {
      console.log('Users: ', res.result);
      this.data = res.result;
      this.pagination = res.pagination;
    });
  }
  refresh() {
    this.text = '';
    this.getAll();
  }
  onPageChange($event) {
    this.pagination.currentPage = $event;
    this.getAll();
  }
  openAddRoleModal() {
    const role = {
      ID: 0,
      Name: '',
    };
    const modalRef = this.modalService.open(AddRoleComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add Role';
    modalRef.componentInstance.role = role;
    modalRef.componentInstance.action = 'Add';
    modalRef.result.then((result) => {
      console.log('openAddRoleModal', result );
    }, (reason) => {
    });
  }
  openEditModal(role) {
    const modalRef = this.modalService.open(AddRoleComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Edit Role';
    modalRef.componentInstance.role = role;
    modalRef.componentInstance.action = 'Edit';
    modalRef.result.then((result) => {
      console.log('openEditModal', result );
    }, (reason) => {
    });
  }
}
