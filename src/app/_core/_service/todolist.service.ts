import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_model/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer 0xsRR8WkBG8eaXWn8S9GGAszcVj18sbKtGaoY7Gj8r
    lOH6uPCKhQpr0R495xPPOA8+c0MkwouGMYPDjR5RiaaZAQBejSiuFLToGvFi3Vu9Rsjs
    z2Kp1lRix1G9/6gNMSzHneVygHKuQZQh4qvupbBgdB04t89/1O/w1cDnyilFU=`
  })
};
@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  baseUrl = environment.apiUrl;
  receivedMessage = new BehaviorSubject<boolean>(null);
  currentreceiveMessage = this.receivedMessage.asObservable();
  constructor(private http: HttpClient, private http2: HttpClient) {}
  changeReceiveMessage(message) {
    this.receivedMessage.next(message);
  }
  getTasks() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/%20/%20/%20/%20/%20/%20/%20`).pipe(
      map(response => {
        // console.log('get tasks todolist: ', response);
        return response;
      })
    );
  }
  sortProject() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/project`);
  }
  sortRoutine() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/routine`);
  }
  sortAbnormal() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/abnormal`);
  }
  sortHigh() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/H/%20`);
  }
  sortMedium() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/M/%20`);
  }
  sortLow() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/L/%20`);
  }
  sortByAssignedJob() {
    return this.http.get(`${this.baseUrl}Tasks/SortBy/assigned/Assigned`);
  }
  sortByBeAssignedJob() {
    return this.http.get(`${this.baseUrl}Tasks/SortBy/beAssigned/BeAssigned`);
  }
  completed() {
    return this.http.get(`${this.baseUrl}Tasks/SortBy/Done`);
  }
  uncompleted() {
    return this.http.get(`${this.baseUrl}Tasks/SortBy/Undone`);
  }
  saveLineCode(code) {
    return this.http.get(`${this.baseUrl}Tasks/GetCodeLine/${code}/${'state'}`);
  }
  replyBot() {
    const img = {
      replyToken: 'U29d96ba096eb1c00a3ac824c31fd87ca',
      messages: [
          {
              type: 'text',
              text: 'Hello, user'
          },
          {
              type: 'text',
              text: 'May I help you?'
          }
      ]
  };
    return this.http.post(`https://api.line.me/v2/bot/message/reply`, img, httpOptions);
  }
  getTokenLine(code) {
    const body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', code)
    .set('redirect_uri', 'https://e8467219.ngrok.io/todolist')
    .set('client_id', 'HF6qOCM9xL4lXFsqOLPzhJ')
    .set('client_secret', 'IvjiGAE8TAD8DOONBJ0Z71Ir9daUNlqMsy69ebokcQN');
    return this.http2.post(`https://notify-bot.line.me/oauth/token`, body.toString(),
    httpOptions);
  }
  getAuthorize() {
    return this.http.get(`${this.baseUrl}LineNotify`);
  }
  updateTokenLineForUser(id, token) {
    return this.http.get(`${this.baseUrl}Users/UpdateTokenLineForUser/${id}/${token}`);
  }
}
