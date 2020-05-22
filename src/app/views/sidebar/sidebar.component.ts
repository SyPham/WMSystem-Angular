import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { HeaderService } from 'src/app/_core/_service/header.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}
