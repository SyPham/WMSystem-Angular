import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommentService } from 'src/app/_core/_service/comment.service';
import { IComment, ICommentTreeView } from 'src/app/_core/_model/comment.interface';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ClientRouter } from 'src/app/_core/enum/ClientRouter';
import { Browser } from '@syncfusion/ej2-base';
import { ContextMenuComponent, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  totalShow = 3;
 @Input() treeData: ICommentTreeView;
 @Input() taskID: number;
 @Input() clientRouter: ClientRouter;
 comment: IComment;
 userID = JSON.parse(localStorage.getItem('user')).User.ID;
  constructor(
    private commentService: CommentService,
    private alertify: AlertifyService
  ) { }
  ngOnInit() {
    this.comment = {
      ID: this.treeData.ID,
      Content: '',
      TaskCode: '',
      ParentID: 0,
      TaskID: this.taskID,
      UserID: this.userID,
      ClientRouter : this.clientRouter
    };
  }
  
}
