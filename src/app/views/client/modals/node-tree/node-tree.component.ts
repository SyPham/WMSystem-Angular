import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
// This is required
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';

@Component({
  selector: 'app-node-tree',
  templateUrl: './node-tree.component.html',
  styleUrls: ['./node-tree.component.css']
})
export class NodeTreeComponent implements OnInit {
  @Input() node: any;
  @Input() taskID: number;
  @Input() clientRouter: ClientRouter;
  files: any;
  urls: [];
  fileList: File[] = [];
  showImageList: boolean;
  dataComment: object;
  isShow = false;
  isShowIcon = false;
  totalShow: number;
  content: string;
  id: number;
  usernames: any;
  userid = Number(JSON.parse(localStorage.getItem('user')).User.ID);
  mentionConfig: any;
  galleryOptions = [
    { image: false, thumbnailsRemainingCount: true, height: '100px' },
    { breakpoint: 500, width: '100%', thumbnailsColumns: 2 }
  ];
  constructor(
    private commentService: CommentService,
    private alertify: AlertifyService,
    private sanitizer: DomSanitizer,
    private calendar: CalendarsService
  ) { }

  ngOnInit() {
    this.isShow = false;
    this.totalShow = 3;
    this.initialParams();
    this.content = '';
  }
  initialParams() {
    this.getUsernames();

    this.mentionConfig = {
      triggerChar: '@',
      allowSpace: true,
      maxItems: 10,
      mentionSelect($event) {
        // console.log($event);
        return `\r@${$event.label}\r `;
      }
    };
  }
  increseTotalShow() {
    this.totalShow += 3;
  }
  clickReply($event, item) {
    if (item.Level === 2 || item.Level === 1) {
      if (this.userid !== item.UserID) {
        this.content = `\r@${item.Username}\r `;
      }
      this.isShow = !this.isShow;
    }
  }
  getUsernames() {
    this.commentService.getUsernames().subscribe(res => {
      this.usernames = res;
    });
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
    if (event.target.value || this.fileList) {
      // console.log('addSubComment');
      // console.log(event);
      const subComment: IComment = {
        Content: event.target.value,
        TaskID: this.taskID,
        ParentID: parentid,
        TaskCode: '',
        UserID: this.userid,
        ClientRouter: this.clientRouter
      };
      this.commentService.addSubComment(subComment).subscribe(res => {
        if (res) {
          // console.log('addSubComment: ', res);
          this.uploadImage(res);
          this.getAllComment();
          this.alertify.success('You have already added the comment successfully!');
          this.commentService.changeMessage(200);
          this.content = '';
          this.commentService.changeMessage(200);
        } else {
          this.alertify.error('You have already added the comment failed!');
        }
      });
    } else {
      this.alertify.warning('Enter a content!', true);
    }
  }
  defaultImage() {
    return '../../../../assets/img/logo-1.png';
  }
  datetime(d) {
    return this.calendar.JSONDateWithTime(d);
  }
  imageBase64CurrentUser() {
    if (JSON.parse(localStorage.getItem('user')).User.ImageProfile === null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/png;base64, ' + JSON.parse(localStorage.getItem('user')).User.image);
    }
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }

  emojiSelect($event) {
    this.content += $event.emoji.native;
  }
  onClickIcon() {
    this.isShowIcon = !this.isShowIcon;
  }
  displayImage() {
    document.getElementById('image-file-node-tre').click();
  }
  onChangeImageFile($event) {
    // console.log($event);
    this.showImageList = true;
    this.urls = [];
    this.fileList = [];
    this.files = $event.target.files;
    // console.log(this.files);
    if (this.files) {
      for (let file of this.files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
          this.fileList.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
    if (this.urls.length > 5) {
      this.urls = [];
      this.alertify.warning('You have picked too many files. Limit is 10', true);
    }
    // console.log(this.urls);
    // console.log(this.fileList);
  }
  uploadImage(comment) {
    if (this.fileList) {
      const formData = new FormData();
      for (const iterator of this.fileList) {
        formData.append('UploadedFile', iterator);
      }
      formData.append('Comment', comment.ID);
      this.commentService.uploadImages(formData).subscribe( res => {
        // console.log(res);
        this.showImageList = false;
        this.fileList = [];
        this.urls = [];
      });
    }
  }
  removeSelectedFile(index) {
    this.fileList.splice(index, 1);
    this.urls.splice(index, 1);
    if (this.urls.length === 0) {
      this.showImageList = false;
    }
    // console.log(this.fileList);
    // console.log(this.urls);
  }
  renderGalleryImages(item) {
    let listAll = [];
    for (const iterator of item.Images) {
     let child = {
       small: iterator,
       medium: iterator,
       big: iterator
     };
     listAll.push(child);
    }
    return listAll;
   }
}
