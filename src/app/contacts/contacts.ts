
import { NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


interface Contact {
  id: string | number;
  name: string;
  state: string;
  email?: string;
  phone?: string;
  ndis?: string;
  status?: string;
  role?: string;
  lastContact?: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss'],
})
export class Contacts implements OnInit {
  usersArray: any[] = [];
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z. ]+$/)]),
    ndis: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
    state: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
    status: new FormControl('', [Validators.required, Validators.pattern(/^(active|inactive)$/i)]),
    email: new FormControl('', [Validators.email]),
    serviceType: new FormControl('Disability Care')
  });

  showModal = false;
  isLead = false;
  searchText: string = '';
  statusFilter: string = '';
  roleFilter: string = '';
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Contact[]>('http://localhost:3000/participants').subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.contacts = data.map(p => ({
            ...p,
            status: p.status || 'Active',
            role: p.role || 'Participant',
            lastContact: p.lastContact || 'Jan 6, 2025'
          }));
          this.filteredContacts = [...this.contacts];
          this.isLoading = false;
          console.log('Contacts loaded:', this.contacts.length);
        } else {
          this.errorMessage = 'Invalid data format received from API';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.errorMessage = `Failed to load contacts from API: ${error.message || 'Server not responding'}`;
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredContacts = this.contacts.filter(contact => {
      const matchesSearch = !this.searchText ||
        contact.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(this.searchText.toLowerCase())) ||
        (contact.ndis && contact.ndis.includes(this.searchText)) ||
        (contact.phone && contact.phone.includes(this.searchText));

      const matchesStatus = !this.statusFilter || contact.status === this.statusFilter;
      const matchesRole = !this.roleFilter || contact.role === this.roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.statusFilter = '';
    this.roleFilter = '';
    this.applyFilters();
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  openAddContact() {
    this.isLead = false;
    this.showModal = true;
    this.userForm.reset();
  }

  openAddLead() {
    this.isLead = true;
    this.showModal = true;
    this.userForm.reset();
  }

  closeModal() {
    this.showModal = false;
  }

  // saveEntry() {
  //       if (this.userForm.valid) {
  //         const newEntry = {
  //           role: this.isLead ? 'lead' : 'participant',
  //           name: this.userForm.value.name,
  //           id: this.userForm.value.ndis,
  //           state: this.userForm.value.state,
  //           status: this.userForm.value.status,
  //           email: this.userForm.value.email || 'No Email',
  //           serviceType: this.userForm.value.serviceType,
  //           lastContacted: new Date().toLocaleDateString('en-US'),
  //           staff: 'Sarah Taylor'
  //         };
  //         this.usersArray.push(newEntry);
  //         this.showModal = false;
  //       } else {
  //         alert('Please fill all required fields correctly.');
  //       }
  //     }
  saveEntry() {
    if (this.userForm.valid) {
      const newEntry: Contact = {
        id: Number(this.userForm.value.ndis) || Date.now(), // fallback ID if NDIS is empty
        name: this.userForm.value.name!,
        state: this.userForm.value.state!,
        status: this.userForm.value.status!,
        role: this.isLead ? 'lead' : 'participant',
        email: this.userForm.value.email || 'No Email',
        ndis: this.userForm.value.ndis || undefined,
        lastContact: new Date().toLocaleDateString('en-US')
      };

      // this.contacts.push(newEntry);

      // this.applyFilters();

      // this.showModal = false;

      // this.userForm.reset();

      this.http.post<Contact>('http://localhost:3000/participants', newEntry).subscribe({
        next: (savedContact) => {
          // Add returned contact to local array
          this.contacts.push(savedContact);
          this.applyFilters();
          this.showModal = false;
          this.userForm.reset();
          console.log('Contact saved:', savedContact);
        },
        error: (error) => {
          console.error('Error saving contact:', error);
          alert('Failed to save contact. Please try again.');
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

      onNameInput(event: any) {
        const input = event.target.value;
        event.target.value = input.replace(/[^A-Za-z. ]/g, '');
        this.userForm.get('name')?.setValue(event.target.value, { emitEvent: false });
      }

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

  refreshContacts() {
    this.loadContacts();
  }
}


// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// interface Contact {
//   id: string | number;
//   name: string;
//   email?: string;
//   phone?: string;
//   ndis?: string;
//   status?: string;
//   role?: string;
//   lastContact?: string;
// }

// @Component({
//   selector: 'app-contacts',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule,
//   ]
//   ,
//   templateUrl: './contacts.html',
//   styleUrls: ['./contacts.scss']
// })
// export class Contacts implements OnInit {
//   searchText = '';
//   statusFilter = '';
//   roleFilter = '';
//   contacts: Contact[] = [];
//   filteredContacts: Contact[] = [];
//   isLoading = false;
//   errorMessage = '';
//   usersArray: any[] = [];

//   showModal = false;
//   isLead = false;

  // userForm = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z. ]+$/)]),
  //   ndis: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
  //   state: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
  //   status: new FormControl('', [Validators.required, Validators.pattern(/^(active|inactive)$/i)]),
  //   email: new FormControl('', [Validators.email]),
  //   serviceType: new FormControl('Disability Care')
  // });

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadContacts();
//   }

//   // loadContacts() {
//   //   this.isLoading = true;
//   //   this.errorMessage = '';
//   //   this.http.get<Contact[]>('http://localhost:3000/participants').subscribe({
//   //     next: (data) => {
//   //       this.contacts = data.map(p => ({
//   //         ...p,
//   //         status: p.status || 'Active',
//   //         role: p.role || 'Participant',
//   //         lastContact: p.lastContact || 'Jan 6, 2025'
//   //       }));
//   //       this.filteredContacts = [...this.contacts];
//   //       this.isLoading = false;
//   //     },
//   //     error: (error) => {
//   //       this.errorMessage = `Failed to load contacts: ${error.message || 'Server not responding'}`;
//   //       this.isLoading = false;
//   //     }
//   //   });
//   // }

//   loadContacts() {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.http.get<Contact[]>('http://localhost:3000/participants').subscribe({
//       next: (data) => {
//         if (Array.isArray(data)) {
//           this.contacts = data.map(p => ({
//             id: p.id,
//             name: p.name,
//             email: p.email || 'No Email',
//             ndis: p.ndis,
//             status: p.status || 'Active',
//             role: p.role || 'Participant',
//             lastContact: p.lastContact || 'Jan 6, 2025'
//           }));
//           this.filteredContacts = [...this.contacts];
//           this.isLoading = false;
//           console.log('Contacts loaded:', this.contacts);
//         } else {
//           this.errorMessage = 'Invalid data format';
//           this.isLoading = false;
//         }
//       },
//       error: (err) => {
//         this.errorMessage = `Failed to load contacts: ${err.message || 'Server not responding'}`;
//         this.isLoading = false;
//         console.error(err);
//       }
//     });
//   }


//   applyFilters() {
//     this.filteredContacts = this.contacts.filter(contact => {
//       const matchesSearch = !this.searchText ||
//         contact.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
//         (contact.email && contact.email.toLowerCase().includes(this.searchText.toLowerCase())) ||
//         (contact.ndis && contact.ndis.includes(this.searchText)) ||
//         (contact.phone && contact.phone.includes(this.searchText));

//       const matchesStatus = !this.statusFilter || contact.status === this.statusFilter;
//       const matchesRole = !this.roleFilter || contact.role === this.roleFilter;

//       return matchesSearch && matchesStatus && matchesRole;
//     });
//   }

//   clearFilters() {
//     this.searchText = '';
//     this.statusFilter = '';
//     this.roleFilter = '';
//     this.applyFilters();
//   }

  // openAddContact() {
  //   this.isLead = false;
  //   this.showModal = true;
  //   this.userForm.reset();
  // }

  // openAddLead() {
  //   this.isLead = true;
  //   this.showModal = true;
  //   this.userForm.reset();
  // }

  // closeModal() {
  //   this.showModal = false;
  // }

  // saveEntry() {
  //       if (this.userForm.valid) {
  //         const newEntry = {
  //           role: this.isLead ? 'lead' : 'participant',
  //           name: this.userForm.value.name,
  //           id: this.userForm.value.ndis,
  //           state: this.userForm.value.state,
  //           status: this.userForm.value.status,
  //           email: this.userForm.value.email || 'No Email',
  //           serviceType: this.userForm.value.serviceType,
  //           lastContacted: new Date().toLocaleDateString('en-US'),
  //           staff: 'Sarah Taylor'
  //         };
  //         this.usersArray.push(newEntry);
  //         this.showModal = false;
  //       } else {
  //         alert('Please fill all required fields correctly.');
  //       }
  //     }


  //     onNameInput(event: any) {
  //       const input = event.target.value;
  //       event.target.value = input.replace(/[^A-Za-z. ]/g, '');
  //       this.userForm.get('name')?.setValue(event.target.value, { emitEvent: false });
  //     }

  //     onNdisInput(event: Event) {
  //       const inputElement = event.target as HTMLInputElement;
  //       const cleaned = (inputElement.value || '').replace(/\D/g, ''); // keep digits only
  //       inputElement.value = cleaned;
  //       this.userForm.get('ndis')?.setValue(cleaned, { emitEvent: false });
  //       // console.log('NDIS input:', cleaned, typeof cleaned);

  //     }


  //     onStateInput(event: any) {
  //       const input = event.target.value;
  //       event.target.value = input.replace(/[^A-Za-z ]/g, '');
  //       this.userForm.get('state')?.setValue(event.target.value, { emitEvent: false });
  //     }

  //     onStatusInput(event: any) {
  //       const input = event.target.value;
  //       event.target.value = input.replace(/[^A-Za-z ]/g, '');
  //       this.userForm.get('status')?.setValue(event.target.value, { emitEvent: false });
  //     }
  //     getStatusClass(status: string): string {
  //       switch (status.toLowerCase()) {
  //         case 'active':
  //           return 'status-green';
  //         case 'inactive':
  //           return 'status-red';
  //         case 'pending':
  //           return 'status-yellow';
  //         default:
  //           return '';
  //       }
  //     }
  //     refreshContacts() {
  //       this.loadContacts();
  //     }
// }
