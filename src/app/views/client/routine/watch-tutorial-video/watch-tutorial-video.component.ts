import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-watch-tutorial-video',
  templateUrl: './watch-tutorial-video.component.html',
  styleUrls: ['./watch-tutorial-video.component.css']
})
export class WatchTutorialVideoComponent implements OnInit {
  @Input() src: string;
  @Input() name: string;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

}
