import { Component, OnInit } from '@angular/core';
import { OcUserService } from 'src/app/_core/_service/oc-user.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { UserService } from 'src/app/_core/_service/user.service';
import { Pagination } from 'src/app/_core/_model/pagination';

@Component({
  selector: 'app-oc-user',
  templateUrl: './oc-user.component.html',
  styleUrls: ['./oc-user.component.css']
})
export class OcUserComponent implements OnInit {
  ocs: any;
  data: any;
  public toolbarOptions: any[];
  pagination: Pagination;
  page: number;
  pageSize: number;
  ocid: 0;
  totalItems: number;
  show: boolean;
  constructor(
    private ocUserService: OcUserService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.optionGridTree();
    this.getOcs();
  }
  created() {
    this.getOcs();
  }
  onChange($event, item) {
    console.log('OnChange: ', $event);
    console.log('OnChange item: ', item);
    this.ocUserService.addOrUpdate(item.ID, this.ocid, $event.checked).subscribe( (res: any) => {
      console.log('addOrUpdate: ', res);
      if (res.status) {
        this.getListUser();
        this.alertify.success(res.message);
      } else {
        this.getListUser();
        this.alertify.warning(res.message, true);
      }
    });
  }
  optionGridTree() {
    this.show = false;
    this.toolbarOptions = [
      'Search',
      'ExpandAll',
      'CollapseAll'
    ];
  }
  getOcs() {
    this.ocUserService.getOCs().subscribe( res => {
      this.ocs = res;
    });
  }
  rowSelected(arg) {
    console.log(arg);
    this.show = true;
    const data = arg.data;
    this.ocid = data.key;
    this.getListUser();
  }
  getListUser() {
    this.ocUserService.getListUser(this.page, this.pageSize, this.ocid).subscribe( res => {
      console.log('Users: ', res.result);
      this.data = res.result;
      this.pagination = res.pagination;
      this.page = res.pagination.currentPage;
      this.pageSize = res.pagination.itemsPerPage;
      this.totalItems = res.pagination.totalItems;
    });
  }
  onPageChange($event) {
    this.page = $event;
    this.getListUser();
  }
}
