import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_model/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../_model/Task';
import { IHeader } from '../_model/header.interface';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};
@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  baseUrl = environment.apiUrl;
  messageSource = new BehaviorSubject<IHeader>(null);
  currentMessage = this.messageSource.asObservable();
  imgSource = new BehaviorSubject<string>('');
  currentImage = this.imgSource.asObservable();
  constructor(private http: HttpClient, private http2: HttpClient) {}
  // method này để change source message
  changeMessage(message) {
    this.messageSource.next(message);
  }
  changeImage(message) {
    this.imgSource.next(message);
  }
  getAllNotificationCurrentUser(page, pageSize, userid) {
    return this.http.get(`${this.baseUrl}Home/getAllNotificationCurrentUser/${page}/${pageSize}/${userid}`).pipe(
      map(response => {
        console.log('getAllNotificationCurrentUser: ', response);
        return response;
      })
    );
  }
  seen(item) {
    return this.http.get(`${this.baseUrl}Home/Seen/${item.ID}`);
  }
  test() {
    return this.http.post('https://notify-api.line.me/api/notify/',
      {
        message: 'Hi peter, nice to meet you ',
        stickerPackageId: 1,
        stickerId: 2
    }, {
      headers: {
          Authorization: 'Bearer ' + '76b67a31f18e173961df0e6c5a0df1f4',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': 'https://notify-api.line.me/api/notify',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }});
  }

  checkTask(userId = 0) {
    return this.http.get(`${this.baseUrl}Home/TaskListIsLate`);
  }
}
