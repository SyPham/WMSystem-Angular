import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/_core/_model/Task';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() title: string;
  public content: string;
  @Input() taskID: number;
  @Input() clientRouter: ClientRouter;
  files: any;
  urls: [];
  fileList: File[] = [];
  showImageList: boolean;
  userid = JSON.parse(localStorage.getItem('user')).User.ID;
  comment: IComment;
  dataComment: ICommentTreeView[];
  totalShow = -1;
  constructor(
    private commentService: CommentService,
    public activeModal: NgbActiveModal,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.initialParams();
    this.onService();
    this.getAllComment();
  }
  initialParams() {
    this.totalShow = 3;
    this.comment = {
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

  getAllComment() {
    this.commentService.getAllComment(this.taskID, this.userid).subscribe((res: ICommentTreeView[]) => {
      this.dataComment = [];
      this.dataComment = res;
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
       small: iterator,
       medium: iterator,
       big: iterator
     };
     listAll.push(child);
    }
    return listAll;
   }
}
