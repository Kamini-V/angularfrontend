import { Routes } from '@angular/router';
import { ShopOwnerListComponent } from './components/shop-owner-list/shop-owner-list.component';
import { ShopOwnerFormComponent } from './components/shop-owner-form/shop-owner-form.component';
import { ShopOwnerDetailsComponent } from './components/shop-owner-details/shop-owner-details.component';

export const routes: Routes = [
  { path: '', component: ShopOwnerListComponent },
  { path: 'create', component: ShopOwnerFormComponent },
  { path: 'edit/:id', component: ShopOwnerFormComponent },
  { path: 'view/:id', component: ShopOwnerDetailsComponent },
  { path: '**', redirectTo: '' }
];