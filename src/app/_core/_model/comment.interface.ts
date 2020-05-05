import { ClientRouter } from '../enum/ClientRouter';

export interface IComment {
    Content: string;
    TaskCode: string;
    TaskID: number;
    ParentID: number;
    UserID: number;
    ClientRouter: ClientRouter;
}
export interface ICommentTreeView {
     ID: number;
     Username: string;
     UserID: number;
     TaskID: number;
     Content: string;
     ParentID: number;
     ImageBase64: string;
     CreatedTime: string;
     Seen: boolean;
     HasChildren: boolean;
     children: ICommentTreeView[];
}