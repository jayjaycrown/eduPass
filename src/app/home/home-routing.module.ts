import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/scan',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'scan',
        children: [
          {
            path: '',
            loadChildren: () => import('../scan/scan.module').then(m => m.ScanPageModule)
          }
        ]
      },
      {
        path: 'lists',
        children: [
          {
            path: '',
            loadChildren: () => import('../list/lists/lists.module').then(m => m.ListsPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('../list/create-list/create-list.module').then(m => m.CreateListPageModule)
          },
          {
            path: 'item/:listId',
            loadChildren: () => import('../list/list-item/list-item.module').then(m => m.ListItemPageModule)
          }
        ]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
