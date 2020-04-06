import { Component, OnInit } from '@angular/core';
import { Nav } from 'src/app/_core/_model/nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any;
  constructor() { }

  ngOnInit() {
    this.data = new Nav().getNavAdmin(true);
    console.log('Dashboard: ', this.data);
  }

}
