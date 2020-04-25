import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from './breadcrumb.interface';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadcrumb[];
  constructor() {}
  ngOnInit() {}
}
