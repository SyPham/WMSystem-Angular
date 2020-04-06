import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskService } from 'src/app/_core/_service/addTask.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RoutineService } from 'src/app/_core/_service/routine.service';
import { TutorialService } from 'src/app/_core/_service/tutorial.service';

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
    private addTaskService: AddTaskService,
    private alertify: AlertifyService,
    private routineService: RoutineService,
    private tutorialService: TutorialService
  ) { }

  ngOnInit() {
  }

}
