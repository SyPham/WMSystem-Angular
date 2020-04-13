import { Component, OnInit, Input } from '@angular/core';
import { RoleService } from 'src/app/_core/_service/role.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { IRole } from 'src/app/_core/_model/role';
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  @Input() title: string;
  @Input() role = {
    ID: 0,
    Name: '',
  };
  @Input() action: string;
  public fields: object = { text: 'Name', value: 'ID' };
  public text = 'Please select a role!';
  constructor(
    private roleService: RoleService,
    public activeModal: NgbActiveModal,
    private alertify: AlertifyService,

  ) { }

  ngOnInit() {
    if (this.action === 'Add') {
      console.log('ADD: ', this.role);
    } else {
      console.log('Edit: ', this.role);
    }
  }
  validation() {
    if (this.role.Name === '') {
      this.alertify.warning('Please enter role name!', true);
      return false;
    } else {
      return true;
    }
  }
  save() {
    if (this.action === 'Add') {
      if (this.validation()) {
        this.create();
      }
    } else {
      if (this.validation()) {
        this.update();
      }
    }
  }
  create() {
    this.roleService.create(this.role).subscribe( res => {
      this.alertify.success('The role has been created!');
      this.roleService.changeMessage(200);
      this.activeModal.dismiss();
    });
  }
  update() {
    this.roleService.update(this.role).subscribe( res => {
      this.alertify.success('The role has been updated!');
      this.roleService.changeMessage(200);
      this.activeModal.dismiss();
    });
  }
}
