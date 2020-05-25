import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_core/_service/auth.service';
import { AlertifyService } from '../../_core/_service/alertify.service';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = {};
  uri: any;
  routerLinkAdmin = [
    '/admin/oc',
    '/admin/user',
    '/admin/oc-user',
    '/admin/role',
    '/admin/dash'
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {
    this.route.queryParams.subscribe(params => {
      this.uri = params.uri;
    });
  }
  role: number;
  ngOnInit(): void {
  }
  login(): void {
    // console.log(this.user);
    this.authService.login(this.user).subscribe(
      next => {
        this.role = JSON.parse(localStorage.getItem('user')).User.Role;
        this.alertifyService.success('Login Success!!');
        this.checkRole();
      },
      error => {
        this.alertifyService.error('Login failed!!');
      },
      () => {
      }
    );
  }
  checkRoute(uri) {
    let flag = false;
    this.routerLinkAdmin.forEach(element => {
      if (uri.includes(element)) {
        flag = true;
      }
    });
    return flag;
  }
  checkRole() {
    const uri = decodeURI(this.uri);
    if (this.role === 1) {
      if (uri !== 'undefined') {
        if (this.checkRoute(uri)) {
          this.router.navigate([uri]);
        } else {
          this.router.navigate(['/admin/dash']);
        }
      } else {
        this.router.navigate(['/admin/dash']);
      }
    } else if (this.role === 2) {
      if (uri !== 'undefined') {
        if (!this.checkRoute(uri)) {
          this.router.navigate([uri]);
        } else {
          this.router.navigate(['/todolist']);
        }
      } else {
        this.router.navigate(['/todolist']);
      }
    }
  }
}
