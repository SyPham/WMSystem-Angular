// Angular
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { AdminRoutingModule } from "./admin-routing.module";
import { RoleComponent } from "./role/role.component";
import { UserComponent } from "./user/user.component";
import { OcUserComponent } from "./oc-user/oc-user.component";
import { OcComponent } from "./oc/oc.component";
import { OcResolver } from 'src/app/_core/_resolvers/oc.resolvers';
import { MultiSelectModule, DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { SparklineAllModule } from '@syncfusion/ej2-angular-charts';
import { ToolbarModule, ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';
import { DatePickerModule, DateRangePickerAllModule, DateTimePickerModule, DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchModule, CheckBoxAllModule, ButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { SafePipeModule } from 'safe-pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddOcComponent } from './modal/add-oc/add-oc.component';
import { AddUserComponent } from './modal/add-user/add-user.component';
import { AddRoleComponent } from './modal/add-role/add-role.component';

// Components Routing

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AdminRoutingModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
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
    NgbModule,
    NgbPaginationModule
  ],
  declarations: [
    OcComponent,
    UserComponent,
    OcUserComponent,
    RoleComponent,
    DashboardComponent,
    AddOcComponent,
    AddUserComponent,
    AddRoleComponent
  ],
  providers: [
    OcResolver,
  ],
})
export class AdminModule {}
