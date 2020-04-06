import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
@Input() title: string;
public content: string;
@Input() taskID: number;
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
    this.totalShow = 3;
    this.comment = {
      Content: this.content,
      ParentID: 0,
      TaskID: this.taskID,
      UserID: this.userid
    };
    this.commentService.currentMessage.subscribe(res => {
      if (res === 200) {
         this.getAllComment();
      }
    });
    this.getAllComment();
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
      console.log('addComment');
      this.comment.Content = this.content;
      this.commentService.addComment(this.comment).subscribe(res => {
        if (res) {
          this.alertify.success('You have already added the comment successfully!');
          this.getAllComment();
        } else {
          this.alertify.error('You have already added the comment failed!');
        }
      });
  }
}
