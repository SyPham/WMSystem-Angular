import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_core/_service/user.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { User, UserGetAll } from 'src/app/_core/_model/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_core/_model/pagination';
import { AddUserComponent } from '../modal/add-user/add-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: any;
  public data: any;
  public text: string;
  pagination: Pagination;
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resolver();
    this.onService();
  }
  onService() {
    this.userService.currentMessage.subscribe( res => {
      if (res === 200) {
        this.getAll();
      }
    });
  }
  resolver() {
    this.route.data.subscribe(res => {
      console.log('resolver: ', res.users.result)
      this.data = res.users.result;
      this.pagination = res.users.pagination;
    });
  }

  delete(id) {
    this.alertify.confirm(
      'Delete User',
      'Are you sure you want to delete this UserID "' + id + '" ?',
      () => {
        this.userService.delete(id).subscribe( res => {
          this.alertify.success('The user has been deleted!');
          this.getAll();
        });
      }
    );
  }
  getAll() {
    this.userService.getAllUsers(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe( res => {
      console.log('Users: ', res.result);
      this.data = res.result;
      this.pagination = res.pagination;
    });
  }
  search() {
    this.userService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text).subscribe( res => {
      console.log('Search: ', res.result);
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
  openAddUserModal() {
    const modalRef = this.modalService.open(AddUserComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add User';
    modalRef.componentInstance.action = 'Add';
    modalRef.result.then((result) => {
      console.log('openAddUserModal', result );
    }, (reason) => {
    });
  }
  openEditModal(user) {
    const modalRef = this.modalService.open(AddUserComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Edit User';
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.action = 'Edit';
    modalRef.result.then((result) => {
      console.log('openEditModal', result );
    }, (reason) => {
    });
  }
}
