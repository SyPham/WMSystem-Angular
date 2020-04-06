import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OcService } from 'src/app/_core/_service/oc.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';

@Component({
  selector: 'app-add-oc',
  templateUrl: './add-oc.component.html',
  styleUrls: ['./add-oc.component.css']
})
export class AddOcComponent implements OnInit {
  @Input() oc: any;
  @Input() title: string;
  constructor(
    public activeModal: NgbActiveModal,
    private ocService: OcService,
    private alertify: AlertifyService,
  ) { }

  ngOnInit() {
  }
  validation() {
    if (this.oc.name === '') {
      this.alertify.warning('Please enter oc name!', true);
      return false;
    } else {
      return true;
    }
  }
  createOC() {
    if (this.validation()) {
      if (this.oc.parentid > 0) {
        this.ocService.createSubOC(this.oc).subscribe(res => {
          this.alertify.success('OC has been created!!');
          this.activeModal.dismiss();
          this.ocService.changeMessage(200);
        });
      } else {
        this.ocService.createMainOC(this.oc).subscribe(res => {
          this.ocService.changeMessage(200);
          this.alertify.success('OC has been created!!');
          this.activeModal.dismiss();
        });
      }
    }
  }
}
