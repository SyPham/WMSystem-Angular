import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  totalShow = 3;
 @Input() treeData: object;
 @Input() taskID: number;
 comment: IComment;
 userID = JSON.parse(localStorage.getItem('user')).User.ID;
  constructor(
    private commentService: CommentService,
    private alertify: AlertifyService
  ) { }
  ngOnInit() {
    this.comment = {
      Content: '',
      ParentID: 0,
      TaskID: 0,
      UserID: this.userID
    };
  }
}
