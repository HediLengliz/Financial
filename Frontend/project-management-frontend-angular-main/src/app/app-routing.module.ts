import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PageContentComponent } from './components/page-content/page-content.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { AddEmployeeComponent } from './components/employee/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { ShowEmployeeComponent } from './components/employee/show-employee/show-employee.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleComponent } from './components/role/role.component';
import { AddRoleComponent } from './components/role/add-role/add-role.component';
import { ShowRoleComponent } from './components/role/show-role/show-role.component';
import { EditRoleComponent } from './components/role/edit-role/edit-role.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { ShowCategoryComponent } from './components/category/show-category/show-category.component';
import { EditCategoryComponent } from './components/category/edit-category/edit-category.component';
import { DesignationComponent } from './components/designation/designation.component';
import { AddDesignationComponent } from './components/designation/add-designation/add-designation.component';
import { EditDesignationComponent } from './components/designation/edit-designation/edit-designation.component';
import { ShowDesignationComponent } from './components/designation/show-designation/show-designation.component';
import { MemberComponent } from './components/member/member.component';
import { AddMemberComponent } from './components/member/add-member/add-member.component';
import { EditMemberComponent } from './components/member/edit-member/edit-member.component';
import { ShowMemberComponent } from './components/member/show-member/show-member.component';
import { ClientComponent } from './components/client/client.component';
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
import { TaskComponent } from './components/task/task.component';
import { AddTaskComponent } from './components/task/add-task/add-task.component';
import { ShowTaskComponent } from './components/task/show-task/show-task.component';
import { EditTaskComponent } from './components/task/edit-task/edit-task.component';
import { ProfileOverviewComponent } from './components/profile/profile-overview/profile-overview.component';
import { ProfileProjectComponent } from './components/profile/profile-project/profile-project.component';
import { ProfileTeamComponent } from './components/profile/profile-team/profile-team.component';
import { TodoComponent } from './components/todo/todo.component';
import { ReportComponent } from './components/report/report.component';
import { FeatureReportComponent } from './components/feature-report/feature-report.component';
import { DashboardsResolverService } from './services/dashboards-resolver.service';
import { AlreadyLoggedInGuard } from './AlreadyLoggedInGuard.guard';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
    {path: '', component: PageContentComponent,
      resolve: { dashboard: DashboardsResolverService}
    },
    {path: 'employees', component: EmployeeComponent},
    {path: 'add-employee', component: AddEmployeeComponent},
    {path: 'edit-employee/:id', component: EditEmployeeComponent},
    {path: 'show-employee/:id', component: ShowEmployeeComponent},
    {path: 'roles', component: RoleComponent},
    {path: 'add-role', component: AddRoleComponent},
    {path: 'show-role/:id', component: ShowRoleComponent},
    {path: 'edit-role/:id', component: EditRoleComponent},
    {path: 'user-profile', component: ProfileComponent , children: [
      {path: '', component: ProfileOverviewComponent},
      {path: 'project', component: ProfileProjectComponent},
      {path: 'team', component: ProfileTeamComponent},
    ]},
    {path: 'category', component: CategoryComponent},
    {path: 'add-category', component: AddCategoryComponent},
    {path: 'edit-category/:id', component: EditCategoryComponent},
    {path: 'show-category/:id', component: ShowCategoryComponent},
    {path: 'designation', component: DesignationComponent},
    {path: 'add-designation', component: AddDesignationComponent},
    {path: 'edit-designation/:id', component: EditDesignationComponent},
    {path: 'show-designation/:id', component: ShowDesignationComponent},
    {path: 'member', component: MemberComponent},
    {path: 'add-member', component: AddMemberComponent},
    {path: 'edit-member/:id', component: EditMemberComponent},
    {path: 'show-member/:id', component: ShowMemberComponent},
    {path: 'client', component: ClientComponent},
    {path: 'add-client', component: AddClientComponent},
    {path: 'edit-client/:id', component: EditClientComponent},
    {path: 'show-client/:id', component: ShowClientComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'add-admin', component: AddAdminComponent},
    {path: 'edit-admin/:id', component: EditAdminComponent},
    {path: 'show-admin/:id', component: ShowAdminComponent},
    {path: 'projects', component: ProjectComponent},
    {path: 'add-project', component: AddProjectComponent},
    {path: 'show-project/:id', component: ShowProjectComponent},
    {path: 'edit-project/:id', component: EditProjectComponent},
    {path: 'feature', component: FeatureComponent},
    {path: 'add-feature', component: AddFeatureComponent},
    {path: 'show-feature/:id', component: ShowFeatureComponent},
    {path: 'edit-feature/:id', component: EditFeatureComponent},
    {path: 'task', component: TaskComponent},
    {path: 'add-task', component: AddTaskComponent},
    {path: 'show-task/:id', component: ShowTaskComponent},
    {path: 'edit-task/:id', component: EditTaskComponent},
    {path: 'feature/todo/:featureId', component: TodoComponent },
    {path: 'report-project', component: ReportComponent},
    {path: 'report-feature', component: FeatureReportComponent},
    {path: 'unauthorizes', component: UnauthorizedComponent}
  ]},
  {path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedInGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
