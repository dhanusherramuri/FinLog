
import { CommonModule, NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, CommonModule],
  templateUrl: './form-component.html',
  styleUrls: ['./form-component.scss'],
})
export class FormComponent {
  allUsers: any[] = [];
  usersArray: any[] = []; // users for current page
  pageSize = 10
  currentPage = 1;
  totalPages = 0;
  showModal = false;
  userForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z. ]+$/)
    ]),
    ndis: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{9}$/)
    ]),
    state: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ]),
    status: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ])
  });
  onNameInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^A-Za-z. ]/g, '');
    this.userForm.get('name')?.setValue(event.target.value, { emitEvent: false });
  }

  // onNdisInput(event: any) {
  //   const input = event.target.value;
  //   event.target.value = input.replace(/\D/g, '');
  //   this.userForm.get('ndis')?.setValue(event.target.value, { emitEvent: false });
  // }
  onNdisInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cleaned = (inputElement.value || '').replace(/\D/g, ''); // keep digits only
    inputElement.value = cleaned;
    this.userForm.get('ndis')?.setValue(cleaned, { emitEvent: false });
    // console.log('NDIS input:', cleaned, typeof cleaned);

  }


  onStateInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^A-Za-z ]/g, '');
    this.userForm.get('state')?.setValue(event.target.value, { emitEvent: false });
  }

  onStatusInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^A-Za-z ]/g, '');
    this.userForm.get('status')?.setValue(event.target.value, { emitEvent: false });
  }
  constructor(private http: HttpClient) {

    this.getAllUser();
  }

  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  getAllUser() {
    this.http.get('http://localhost:3000/participants')
      .subscribe((res: any) => {
        this.allUsers = res;
        this.totalPages = Math.ceil(this.allUsers.length / this.pageSize);
        this.loadPage(1); // load first page
      });
  }

  loadPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersArray = this.allUsers.slice(startIndex, endIndex);
  }

  displayValue() {
    if (this.userForm.valid) {
      const obj = this.userForm.value;
      this.http.post('http://localhost:3000/participants', obj)
        .subscribe(() => alert('User Created'));
      console.log('Submitted:', obj);
    } else {
      this.userForm.markAllAsTouched();
      console.log("ERROR");
      alert("ERROR")
    }
  }


  goToPrevious() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-green';
      case 'inactive':
        return 'status-red';
      case 'pending':
        return 'status-yellow';
      default:
        return '';
    }
  }

  goToNext() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }


  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.userForm.reset();
  }

}
