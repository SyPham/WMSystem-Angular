import { Component, OnInit , OnDestroy} from '@angular/core';
import { AuthService } from '../../../_core/_service/auth.service';
import { AlertifyService } from '../../../_core/_service/alertify.service';
import { Router } from '@angular/router';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { IHeader } from 'src/app/_core/_model/header.interface';
import * as moment from 'moment';
import { Nav } from 'src/app/_core/_model/nav';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AvatarModalComponent } from './avatar-modal/avatar-modal.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public data: any;
  private intervalID: any;
  public navAdmin: any;
  public navClient: any;
  public total: number;
  public totalCount: number;
  public page: number;
  public pageSize: number;
  public currentUser: string;
  public currentTime: any;
  userid: number;
  role: number;
  avatar: any;
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private signalrService: SignalrService,
    private headerService: HeaderService,
    private calendarsService: CalendarsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,

  ) {
    this.currentTime = moment().format('LTS');
    this.intervalID = setInterval(() => this.updateCurrentTime(), 1 * 1000);
  }

  ngOnInit(): void {
    this.navAdmin = new Nav().getNavAdmin();
    this.navClient = new Nav().getNavClient();
    this.checkTask();
    this.getAvatar();
    this.role = JSON.parse(localStorage.getItem('user')).User.Role;
    this.currentUser = JSON.parse(localStorage.getItem('user')).User.Username;
    this.page = 1;
    this.pageSize = 10;
    this.signalrService.startConnection();
    this.userid = JSON.parse(localStorage.getItem('user')).User.ID;
    this.getNotifications();
    this.onService();
  }
  ngOnDestroy() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }
  onService() {
    this.headerService.currentImage
      .subscribe(arg => {
        console.log('onService header: ', arg);
        if (arg) {
          this.changeAvatar(arg);
        }
      });
    // this.headerService.imgSource.subscribe(res => {
    //   console.log('on Service Avatar', res);
    //   if (res) {
    //      ;
    //   }
    // });
  }
  changeAvatar(avt) {
    let avatar;
    if (avt) {
      avatar = avt.replace('data:image/png;base64,', '').trim();
      // this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl(avt);
      localStorage.removeItem('avatar');
      localStorage.setItem('avatar', avatar);
      this.getAvatar();
    } else {
      this.avatar = this.defaultImage();
    }

  }
  onScrollDown() {
    console.log('scrolled down!!');
    if (this.pageSize >= 200) {
      this.pageSize -= 10;
      this.getNotifications();
    } else {
      this.pageSize += 10;
      this.getNotifications();

    }
  }

  onScrollUp() {
    console.log('scrolled up!!');
    if (this.pageSize >= 200) {
      this.pageSize -= 10;
      this.getNotifications();

    } else {
      this.pageSize += 10;
      this.getNotifications();

    }
  }
  updateCurrentTime() {
    this.currentTime = moment().format('LTS');
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('Logged out');
    const uri = this.router.url;
    this.router.navigate(['login'], {queryParams: {uri}});

  }
  openAvatarModal() {
    const modalRef = this.modalService.open(AvatarModalComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add Routine Main Task';
    // modalRef.componentInstance.user = 1;
    modalRef.result.then((result) => {
      console.log('openAvatarModal', result);
    }, (reason) => {
    });
  }

  pushToMainPage() {
    let role = JSON.parse(localStorage.getItem('user')).User.Role;
    if (role === 1) {
      this.router.navigate(['/admin/dash']);
    } else if (role === 2) {
      this.router.navigate(['/todolist']);
    }
  }
  checkServer() {
    let user = JSON.parse(localStorage.getItem('user')).User.Username;
    setInterval(() => {
      if (this.signalrService.hubConnection.state) {
        console.log(user + 'yeu cau server check alert');
        this.checkAlert();
      } else {
        setTimeout( () => {
          this.router.navigate(['/maintenance']);
        });
      }
    }, 30000);
  }
  checkAlert() {
    let userId = JSON.parse(localStorage.getItem('user')).User.ID;
    this.signalrService.checkAlert(userId);
  }
  getNotifications() {
    console.log('getNotifications: ', this.userid);

    this.headerService.getAllNotificationCurrentUser(this.page, this.pageSize, this.userid).subscribe( (res: any) => {
      this.data = res.model;
      this.total = res.total;
      this.totalCount = res.TotalCount;
    });
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
  getAvatar() {
    let img = localStorage.getItem('avatar');
    if (img == null) {
      this.avatar = this.defaultImage();
    } else {
      this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  datetime(d) {
    return this.calendarsService.JSONDateWithTime(d);
  }
  checkTask() {
    this.headerService.checkTask(this.userid)
      .subscribe(() => console.log('Vua moi kiem tra nhiem vu - ', this.userid));
  }
  seen(item) {
    console.log('seen: ', item);
    this.headerService.seen(item).subscribe(res => {
      this.page = 1;
      this.data = [];
      this.getNotifications();
    });
    let obj: IHeader = {
      router: item.URL.split('/')[1],
      message: item.URL.split('/')[2],
    };
    if (obj.router === 'project-detail') {
      this.router.navigate([item.URL.replace('project-detail', 'project/detail')]);
    } else {
      // this.headerService.changeMessage(obj);
       let url = `/${obj.router}`;
       this.router.navigate([item.URL]);
    }
  }
}