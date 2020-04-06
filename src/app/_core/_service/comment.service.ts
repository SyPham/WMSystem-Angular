import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_model/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IComment, ICommentTreeView } from '../_model/comment.interface';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};
@Injectable({
  providedIn: 'root'
})

export class CommentService {
  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient) { }
  changeMessage(message) {
    this.messageSource.next(message);
  }
  create(formData: FormData) {
    return this.http.post(this.baseUrl + 'Tutorial/Create', formData);
  }
  getAllComment(taskID: number, userid: number): Observable<ICommentTreeView[]> {
    return this.http.get<ICommentTreeView[]>(`${this.baseUrl}Comments/GetAll/${taskID}/${userid}`).pipe(
      map(response => {
        console.log('getAllComment: ', response);
        return response;
      })
    );
  }
  addSubComment(subComment: IComment) {
    return this.http.post(this.baseUrl + 'Comments/AddSub', subComment);
  }
  addComment(comment: IComment) {
    return this.http.post(this.baseUrl + 'Comments/Add', comment);
  }
}

