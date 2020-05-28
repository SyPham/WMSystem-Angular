// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
// Components Routing
import { ClientRoutingModule } from './client-routing.module';
import { TodolistComponent } from './todolist/todolist.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ListTaskProjectComponent } from './project-detail/list-task-project/list-task-project.component';

import { RoutineComponent } from './routine/routine.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AbnormalComponent } from './abnormal/abnormal.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { HistoryComponent } from './history/history.component';
import { FollowComponent } from './follow/follow.component';
import { MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";

import { SparklineAllModule } from '@syncfusion/ej2-angular-charts';

import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { ToolbarModule, ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule , CheckBoxAllModule} from '@syncfusion/ej2-angular-buttons';

import { DatePickerModule, DatePickerAllModule, DateRangePickerAllModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';

import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import { AddSubTaskComponent } from './project-detail/list-task-project/add-sub-task/add-sub-task.component';
import { RoutineResolver } from 'src/app/_core/_resolvers/routine.resolvers';
import { AddTaskModalComponent } from './routine/add-task-modal/add-task-modal.component';
import { TutorialModalComponent } from './routine/tutorial-modal/tutorial-modal.component';

import { SafePipeModule } from 'safe-pipe';
import { WatchTutorialVideoComponent } from './routine/watch-tutorial-video/watch-tutorial-video.component';
import { CommentComponent } from './modals/comment/comment.component';
import { NodeTreeComponent } from './modals/node-tree/node-tree.component';
import { TreeComponent } from './modals/tree/tree.component';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbPaginationModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HistoryResolver } from 'src/app/_core/_resolvers/history.resolvers';
import { MentionModule } from 'angular-mentions';
import { ContentEditableFormDirective } from 'src/app/content-editable-form.directive';
import { DragScrollModule } from 'ngx-drag-scroll';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { RoutineDetailComponent } from './modals/routine-detail/routine-detail.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ContextMenuModule  } from '@syncfusion/ej2-angular-navigations';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ClientRoutingModule,
    MultiSelectModule,
    TreeGridAllModule,
    NumericTextBoxAllModule,
    SparklineAllModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    ToolbarModule,
    ToolbarAllModule,
    ButtonAllModule,
    CheckBoxAllModule,
    DatePickerModule,
    DatePickerAllModule,
    DateTimePickerModule,
    DateRangePickerAllModule,
    SafePipeModule,
    SwitchModule,
    DragScrollModule,
    NgbModule,
    NgbPaginationModule,
    MentionModule,
    TooltipModule,
    RichTextEditorModule,
    PickerModule,
    UploaderModule,
    NgxGalleryModule,
    TextBoxModule,
    DateInputsModule,
    ContextMenuModule
      ],
  declarations: [
    TodolistComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ListTaskProjectComponent,
    RoutineComponent,
    TutorialComponent,
    AbnormalComponent,
    ChatGroupComponent,
    HistoryComponent,
    FollowComponent,
    AddSubTaskComponent,
    AddTaskModalComponent,
    TutorialModalComponent,
    WatchTutorialVideoComponent,
    CommentComponent,
    NodeTreeComponent,
    ContentEditableFormDirective,
    TreeComponent,
    RoutineDetailComponent,
  ],
  providers: [
    RoutineResolver
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientModule {}