import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_core/_service/user.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @Input() title: string;
  @Input() user: any;
  @Input() action: string;
  role: any;
  public fields: object = { text: 'Name', value: 'ID' };
  public text = 'Please select a role!';
  constructor(
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private alertify: AlertifyService,

  ) { }

  ngOnInit() {
    this.checkAction();
    this.getRoles();
  }
  checkAction() {
    if (this.action === 'Add') {
      this.user = {
        id: 0,
        username: '',
        password: '',
        email: '',
        roleid: 0,
        isLeader: false
      }
    }
  }
  getRoles() {
    this.userService.getRole().subscribe( res => {
      this.role = res;
      console.log('Roles: ', res);
    });
  }
  validation() {
    if (this.user.username === '') {
      this.alertify.warning('Please enter username!', true);
      return false;
    } else if (this.user.password === '') {
      this.alertify.warning('Please enter password!', true);
      return false;
    } else if (this.user.email === '') {
      this.alertify.warning('Please enter email!', true);
      return false;
    } else if (this.user.roleid === 0) {
      this.alertify.warning('Please enter role!', true);
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
    this.userService.create(this.user).subscribe( res => {
      this.alertify.success('The user has been created!');
      this.userService.changeMessage(200);
      this.activeModal.dismiss();
    });
  }
  update() {
    this.userService.update(this.user).subscribe( res => {
      this.alertify.success('The user has been updated!');
      this.userService.changeMessage(200);
      this.activeModal.dismiss();
    });
  }
}
