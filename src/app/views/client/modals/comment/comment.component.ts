import { Component, OnInit, Input, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/_core/_model/Task';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(
    private commentService: CommentService,
    public activeModal: NgbActiveModal,
    private alertify: AlertifyService,
    private sanitizer: DomSanitizer,
    private calendar: CalendarsService
  ) { }
  @Input() title: string;
  public content: string;
  @Input() taskID: number;
  @Input() clientRouter: ClientRouter;
  files: any;
  urls: [];
  fileList: File[] = [];
  pin: ICommentTreeView;
  pinHeight: number;
  showImageList: boolean;
  userid = JSON.parse(localStorage.getItem('user')).User.ID;
  comment: IComment;
  dataComment: ICommentTreeView[];
  totalShow = -1;
  galleryOptions = [
    { image: false, thumbnailsRemainingCount: true, height: '80px' },
    { breakpoint: 500, width: '100%', thumbnailsColumns: 2 }
  ];
  ngOnInit() {
    this.initialParams();
    this.onService();
    this.getAllComment();
  }
  ngAfterViewChecked() {
    this.marginTop();
  }
  ngOnDestroy() {
  }
  marginTop() {
    if (this.pin) {
      if (this.pin.Pin) {
        document.getElementById('commentStart').style.marginTop = document.getElementById('pin').offsetHeight + 'px';
      }
    }
  }
  initialParams() {
    this.totalShow = 3;
    this.comment = {
      ID: 0,
      Content: this.content,
      ParentID: 0,
      TaskCode: '',
      TaskID: this.taskID,
      UserID: this.userid,
      ClientRouter: this.clientRouter
    };
  }
  onService() {
    this.commentService.currentMessage.subscribe(res => {
      if (res === 200) {
        this.getAllComment();
      }
    });
  }
  increseTotalShow() {
    this.totalShow += 3;
  }
  checkLoadMore() {
    return this.totalShow < this.dataComment.length;
  }
  flatten(data) {
    let result = [];
    while (data) {
      result.push({ name: data.name, config: data.config });
      data = data.prev;
    }
    return result;
  }
  flatNodeTree(res: ICommentTreeView) {
    const comments: ICommentTreeView[] = [];
    comments.push(res);
    if (res.HasChildren) {
      comments.push(...res.children);
    }
    return comments;
  }
  flatListTree(res: ICommentTreeView[]) {
    const comments: ICommentTreeView[] = [];
    res.map(item => {
      comments.push(...this.flatNodeTree(item));
    });
    return comments;
  }
  getAllComment() {
    this.commentService.getAllComment(this.taskID, this.userid).subscribe((res: ICommentTreeView[]) => {
      this.dataComment = [];
      this.dataComment = res;
      console.log('flatTree :', this.flatListTree(res));
      this.pin = this.flatListTree(res).filter(item => {
        return item.Pin === true;
      })[0];
    });
  }
  addComment() {
    // console.log('addComment', this.comment);
    this.comment.Content = this.content;
    this.commentService.addComment(this.comment).subscribe(res => {
      if (res) {
        this.alertify.success('You have already added the comment successfully!');
        this.uploadImage(res);
        this.getAllComment();
        this.content = '';
      } else {
        this.alertify.error('You have already added the comment failed!');
      }
    });
  }
  unpin() {
    this.alertify.confirm(
      'Unpin this message',
      'Do you want to unpin this message?',
      () => {
        this.commentService.unpin(this.pin.ID).subscribe( res => {
          if (res) {
            this.alertify.success('You unpinned a message!!!');
            this.pin = null;
            document.getElementById('commentStart').style.marginTop = '0px';
            this.commentService.changeMessage(200);
          } else {
            this.alertify.error('Failed to unpin the message!!!');
          }
        });
      }
    );
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
        this.getAllComment();
        // console.log(res);
        this.showImageList = false;
        this.fileList = [];
        this.urls = [];
      });
    }
  }
  displayImage() {
    document.getElementById('image-file-comment').click();
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
       small: environment.imagePath + iterator,
       medium: environment.imagePath + iterator,
       big: environment.imagePath + iterator
     };
     listAll.push(child);
    }
    return listAll;
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
  defaultImage() {
    return '../../../../assets/img/logo-1.png';
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:image/png;base64,' + img);
    }
  }
}
