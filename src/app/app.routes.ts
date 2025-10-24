import { Routes } from '@angular/router';
import { Contacts } from './contacts/contacts';
import { FormComponent } from './form-component/form-component';

export const routes: Routes = [
  { path: '', redirectTo: '/participants', pathMatch: 'full' },
  { path: 'participants', component: FormComponent },
  { path: 'contacts', component: Contacts },
];
