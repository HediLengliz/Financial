import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProjectComponent } from "./components/project/project.component";
import { AddProjectComponent } from "./components/project/add-project/add-project.component";
import { ShowProjectComponent } from "./components/project/show-project/show-project.component";
import { EditProjectComponent } from "./components/project/edit-project/edit-project.component";

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // Default redirect
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },

      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },

      // Projects Section
      {
        path: 'projects',
        children: [
          { path: '', component: ProjectComponent }, // List projects
          { path: 'new', component: AddProjectComponent }, // Create new
          { path: ':id', component: ShowProjectComponent }, // Show details
          { path: 'edit/:id', component: EditProjectComponent } // Edit project
        ]
      },

      // UI Components
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },

      // Extra Pages
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },

  // Authentication Layout (Blank)
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },

  // Wildcard Route (Must be last)
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
