import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
// This is required
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';

@Component({
  selector: 'app-node-tree',
  templateUrl: './node-tree.component.html',
  styleUrls: ['./node-tree.component.css']
})
export class NodeTreeComponent implements OnInit {
  @Input() node: any;
  @Input() taskID: number;
  dataComment: object;
  isShow = false;
  totalShow: number;
  content: string;
  id: number;
  userid = Number(JSON.parse(localStorage.getItem('user')).User.ID);
  constructor(
    private commentService: CommentService,
    private alertify: AlertifyService,
    private sanitizer: DomSanitizer,
    private calendar: CalendarsService
  ) { }

  ngOnInit() {
    this.isShow = false;
    this.totalShow = 3;
    console.log(this.node);
  }
  increseTotalShow() {
    this.totalShow += 3;
  }
  clickReply() {
    this.isShow = !this.isShow;
  }
  getAllComment() {
    this.commentService.getAllComment(this.taskID, this.userid).subscribe((res: ICommentTreeView[]) => {
      this.dataComment = [];
      this.dataComment = res;
    });
  }
  checkMore() {
    return this.totalShow < this.node.children.length || this.node.children.length > this.totalShow;
  }
  addSubComment(event, parentid) {
      console.log('addSubComment');
      console.log(event);
      const subComment: IComment = {
        Content: event.target.value,
        TaskID: this.taskID,
        ParentID: parentid,
        UserID: this.userid
      };
      this.commentService.addSubComment(subComment).subscribe(res => {
        if (res) {
          this.getAllComment();
          this.alertify.success('You have already added the comment successfully!');
          this.commentService.changeMessage(200);
          this.content = '';
          this.commentService.changeMessage(200);
        } else {
          this.alertify.error('You have already added the comment failed!');
        }
      });
  }
  datetime(d) {
    return this.calendar.JSONDateWithTime(d);
  }
  imageBase64CurrentUser() {
    if (JSON.parse(localStorage.getItem('user')).User.ImageProfile === null) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJYAA
      ACWBAMAAADOL2zRAAAAG1BMVEVsdX3////Hy86jqK1+ho2Ql521ur7a3N7s7e5Yhi
      PTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtH
      OTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJ
      J0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvF
      IXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOy
      qPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP
      2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==`);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/png;base64, ' + JSON.parse(localStorage.getItem('user')).User.image);
    }
  }
  imageBase64(img) {
    if (img == null) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJYAA
      ACWBAMAAADOL2zRAAAAG1BMVEVsdX3////Hy86jqK1+ho2Ql521ur7a3N7s7e5Yhi
      PTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtH
      OTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJ
      J0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvF
      IXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOy
      qPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP
      2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==`);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
}
