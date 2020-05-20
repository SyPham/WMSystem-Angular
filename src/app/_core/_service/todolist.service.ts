import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_model/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*'
  })
};
@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private http2: HttpClient) {}
  getTasks() {
    return this.http.get(`${this.baseUrl}Tasks/Todolist/%20/%20/%20/%20/%20/%20/%20`).pipe(
      map(response => {
        console.log('get tasks todolist: ', response);
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
  getTokenLine(code) {
    const body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', code)
    .set('redirect_uri', 'https://localhost:4200//todolist')
    .set('client_id', 'HF6qOCM9xL4lXFsqOLPzhJ')
    .set('client_secret', 'IvjiGAE8TAD8DOONBJ0Z71Ir9daUNlqMsy69ebokcQN');
    return this.http2.post(`https://notify-bot.line.me/oauth/token`, body.toString(),
    httpOptions);
  }
}
