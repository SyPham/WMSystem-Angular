import { Component, OnInit } from '@angular/core';
import { OcService } from 'src/app/_core/_service/oc.service';
import { Oc } from 'src/app/_core/_model/oc';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AddOcComponent } from '../modal/add-oc/add-oc.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-oc',
  templateUrl: './oc.component.html',
  styleUrls: ['./oc.component.css']
})
export class OcComponent implements OnInit {
  data: any;
  editparams: any;
  contextMenuItems: any;
  toolbar: any;
  editing: any;
  pageSettings: any;
  constructor(
    private ocService: OcService,
    private alertify: AlertifyService,
    private modalService: NgbModal,
    private route: ActivatedRoute) { }
  title: string;
  edit: {
    key: 0,
    title: ''
  };
  oc: { id: 0, name: '', level: 0, parentid: 0 };
  modalTitle: string;
  ngOnInit() {
    this.resolver();
    this.optionTreeGrid();
    this.onService();

  }
  onService() {
    this.ocService.currentMessage
      .subscribe(arg => {
        if (arg === 200) {
          this.getOCs();
        }
      });
  }
  optionTreeGrid() {
    this.contextMenuItems = [
      {
        text: 'Add Sub-OC',
        iconCss: ' e-icons e-add',
        target: '.e-content',
        id: 'Add-Sub-OC'
      },
      {
        text: 'Delete',
        iconCss: ' e-icons e-delete',
        target: '.e-content',
        id: 'DeleteOC'
      }
    ];
    this.toolbar = [
      'Search',
      'ExpandAll',
      'CollapseAll',
      'ExcelExport',
      'PdfExport'
    ];
    this.editing = { allowDeleting: true, allowEditing: true, mode: 'Row' };
    this.pageSettings = { pageSize: 20 };
    this.editparams = { params: { format: 'n' } };
  }
  resolver() {
    this.route.data.subscribe(res => {
      this.data = res.ocs;
      console.log('Ocs: ', this.data);
    });
  }
  actionComplete(args) {
    console.log('actionComplete');
    console.log(args);
    if (args.requestType === 'save') {
      this.edit.title = args.previousData.title;
      this.rename();
    }
  }
  rowSelected(args) {
    console.log('rowSelected ');
    console.log(args);
    this.edit = {
      key: args.data.key,
      title: args.data.title
    };
    this.oc = {
      id: 0,
      name: '',
      parentid: args.data.key,
      level: args.data.levelnumber + 1
    };
  }
  rename() {
    this.ocService.rename(this.edit).subscribe(res => {
      this.getOCs();
      this.alertify.success('OC has been changed!!!');
    });
  }
  delete(id) {
    this.alertify.confirm(
      'Delete Project',
      'Are you sure you want to delete this OCID "' + id + '" ?',
      () => {
        this.ocService.delete(id).subscribe(res => {
          this.getOCs();
          this.alertify.success('The OC has been deleted!!!');
        },
        error => {
          this.alertify.error('Failed to delete the OC!!!');
        });
      }
    );
  }
  dataSourceChanged() { }
  contextMenuClick(args) {
    switch (args.item.id) {
      case 'DeleteOC':
        this.delete(args.rowInfo.rowData.key);
        break;
      case 'Add-Sub-OC':
        this.openSubOCModal();
        break;
      default:
        break;
    }
  }
  getOCs() {
    this.ocService.getOCs().subscribe(arg => this.data = arg);
  }
  clearFrom() {
    this.oc = {
      id: 0,
      name: '',
      parentid: 0,
      level: 0
    };
  }
  createOC() { }
  created() {
    this.getOCs();
  }
  openMainOCModal() {
    this.clearFrom();
    const modalRef = this.modalService.open(AddOcComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add OC';
    modalRef.componentInstance.oc = this.oc;
    modalRef.result.then((result) => {
      console.log('openCommentModal', result );
    }, (reason) => {
    });
  }
  openSubOCModal() {
    const modalRef = this.modalService.open(AddOcComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add Sub OC';
    modalRef.componentInstance.oc = this.oc;
    modalRef.result.then((result) => {
      console.log('openSubOCModal', result );
    }, (reason) => {
    });
  }
}
