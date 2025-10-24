import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Contacts } from './contacts/contacts';
import { FormComponent } from './form-component/form-component';


@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    FormComponent,
    FormsModule,
     Contacts],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}
  protected readonly title = signal('Finlog');
}
