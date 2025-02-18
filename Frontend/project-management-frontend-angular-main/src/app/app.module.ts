import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PageContentComponent } from './components/page-content/page-content.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeComponent } from './components/employee/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { ShowEmployeeComponent } from './components/employee/show-employee/show-employee.component';
import { StatusPipe } from './pipes/status.pipe';
import { PriorityPipe } from './pipes/priority.pipe';
import { AddStatusPipe } from './pipes/addstatus.pipe';
import { AddPriorityPipe } from './pipes/addpriority.pipe';
import { ErrorComponent } from './components/error/error.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './auth.interceptor';
import { RoleComponent } from './components/role/role.component';
import { AddRoleComponent } from './components/role/add-role/add-role.component';
import { ShowRoleComponent } from './components/role/show-role/show-role.component';
import { EditRoleComponent } from './components/role/edit-role/edit-role.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { EditCategoryComponent } from './components/category/edit-category/edit-category.component';
import { ShowCategoryComponent } from './components/category/show-category/show-category.component';
import { DesignationComponent } from './components/designation/designation.component';
import { AddDesignationComponent } from './components/designation/add-designation/add-designation.component';
import { EditDesignationComponent } from './components/designation/edit-designation/edit-designation.component';
import { ShowDesignationComponent } from './components/designation/show-designation/show-designation.component';
import { ClientComponent } from './components/client/client.component';
import { MemberComponent } from './components/member/member.component';
import { AddMemberComponent } from './components/member/add-member/add-member.component';
import { EditMemberComponent } from './components/member/edit-member/edit-member.component';
import { ShowMemberComponent } from './components/member/show-member/show-member.component';
import { AddClientComponent } from './components/client/add-client/add-client.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ShowClientComponent } from './components/client/show-client/show-client.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddAdminComponent } from './components/admin/add-admin/add-admin.component';
import { EditAdminComponent } from './components/admin/edit-admin/edit-admin.component';
import { ShowAdminComponent } from './components/admin/show-admin/show-admin.component';
import { ProjectComponent } from './components/project/project.component';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { ShowProjectComponent } from './components/project/show-project/show-project.component';
import { EditProjectComponent } from './components/project/edit-project/edit-project.component';
import { FeatureComponent } from './components/feature/feature.component';
import { AddFeatureComponent } from './components/feature/add-feature/add-feature.component';
import { ShowFeatureComponent } from './components/feature/show-feature/show-feature.component';
import { EditFeatureComponent } from './components/feature/edit-feature/edit-feature.component';
import { ListFeatureComponent } from './components/project/list-feature/list-feature.component';
import { TaskComponent } from './components/task/task.component';
import { AddTaskComponent } from './components/task/add-task/add-task.component';
import { ShowTaskComponent } from './components/task/show-task/show-task.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';
import { ListTaskComponent } from './components/feature/list-task/list-task.component';
import { FeaturePipe } from './pipes/feature.pipe';
import { ProfileOverviewComponent } from './components/profile/profile-overview/profile-overview.component';
import { ProfileProjectComponent } from './components/profile/profile-project/profile-project.component';
import { ProfileTeamComponent } from './components/profile/profile-team/profile-team.component';
import { TodoComponent } from './components/todo/todo.component';
import { ReportComponent } from './components/report/report.component';
import { FeatureReportComponent } from './components/feature-report/feature-report.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    PageContentComponent,
    EmployeeComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ShowEmployeeComponent,
    StatusPipe,
    PriorityPipe,
    AddStatusPipe,
    AddPriorityPipe,
    ErrorComponent,
    ProfileComponent,
    RoleComponent,
    AddRoleComponent,
    ShowRoleComponent,
    EditRoleComponent,
    UnauthorizedComponent,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ShowCategoryComponent,
    DesignationComponent,
    AddDesignationComponent,
    EditDesignationComponent,
    ShowDesignationComponent,
    ClientComponent,
    MemberComponent,
    AddMemberComponent,
    EditMemberComponent,
    ShowMemberComponent,
    AddClientComponent,
    EditClientComponent,
    ShowClientComponent,
    AdminComponent,
    AddAdminComponent,
    EditAdminComponent,
    ShowAdminComponent,
    ProjectComponent,
    AddProjectComponent,
    ShowProjectComponent,
    EditProjectComponent,
    FeatureComponent,
    AddFeatureComponent,
    ShowFeatureComponent,
    EditFeatureComponent,
    ListFeatureComponent,
    TaskComponent,
    AddTaskComponent,
    ShowTaskComponent,
    EditTaskComponent,
    ListTaskComponent,
    FeaturePipe,
    ProfileOverviewComponent,
    ProfileProjectComponent,
    ProfileTeamComponent,
    TodoComponent,
    ReportComponent,
    FeatureReportComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgChartsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
