import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TreeGridComponent, FilterSettingsModel } from '@syncfusion/ej2-angular-treegrid';

@Component({
  selector: 'app-routine-detail',
  templateUrl: './routine-detail.component.html',
  styleUrls: ['./routine-detail.component.css']
})
export class RoutineDetailComponent implements OnInit {
@Input() title: string;
@Input() tasks: any;
public data: any;
@ViewChild('treegridTasks')
public treeGridObj: TreeGridComponent;
public ocs: object;
public srcTutorial: string;
public taskId: number;
public showTasks: boolean;
public parentId: number;
public toolbarOptions: any[];
public toolbarOptionsTasks: any[];
public pageSetting: object;
public listOCs = JSON.parse(localStorage.getItem('user')).User.ListOCs;
public ocLevel = JSON.parse(localStorage.getItem('user')).User.OCLevel;
public isLeader = JSON.parse(localStorage.getItem('user')).User.IsLeader;
public currentUser = JSON.parse(localStorage.getItem('user')).User.ID;
public contextMenuItems: object;
public filterSettings: FilterSettingsModel;
private tutorialName: string;
searchSettings: object;
  constructor() { }

  ngOnInit(): void {
    this.data = this.tasks.RelatedTasks;
    this.optionGridTree();
  }
  optionGridTree() {
    this.filterSettings = { type: 'CheckBox' };
    this.pageSetting = { pageCount: 5, pageSizes: true };
    this.toolbarOptions = [
      'Search',
      'ExpandAll',
      'CollapseAll'
    ];
    this.searchSettings = {
      hierarchyMode: 'Parent',
      fields: ['Entity.JobName'],
      operator: 'contains',
      key: '',
      ignoreCase: true
    };
  }
}
