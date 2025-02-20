import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { GuestService } from '../../services/guest.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { Guest } from '../../model/guest';
import { CommonModule } from '@angular/common';
import { TableComponent } from "../../components/table/table.component";
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchBarService } from '../../services/search-bar.service';
import { Alert } from '../../model/alert';


/**
 * Componente criado para informacoes de hospedes.
 * O componente exibe formularios e listagem do CRUD.
 */
@Component({
  selector: 'app-guests',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ModalComponent, CommonButtonComponent, AlertComponent, TableComponent, SearchBarComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss'
})
export class GuestsComponent implements OnInit, AfterViewInit {

  guestList: Array<Guest> = new Array<Guest>;
  formGuests: FormGroup;
  existingEmail: boolean = false;
  existingDocument: boolean = false;
  alertAll: boolean = false;
  alert: Alert = { value: false, type: "", message: "" };
  deletedGuest: string = "";
  updatedGuest: Guest | null = null;

  checkboxStates = {
    name: false,
    email: false,
    document: false,
  };

  constructor (
    private guestService: GuestService,
    private searchBarService: SearchBarService
  ) {
    this.formGuests = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadGuests();
  }

  ngAfterViewInit(): void {
    this.searchBarService.searchBarSubject$.subscribe({
      next: (searchValue) => {
        if (searchValue !== "") {
          const newGuestList = new Array<Guest>;
          this.guestList.forEach((guest) => {
            if (
              (guest.name.toLowerCase().includes(searchValue.toLowerCase()) && this.checkboxStates.name) ||
              (guest.email.toLowerCase().includes(searchValue.toLowerCase()) && this.checkboxStates.email) ||
              (guest.document.toLowerCase().includes(searchValue.toLowerCase()) && this.checkboxStates.document)
            ) {
              newGuestList.push(guest);
            }
          });
          this.guestList = newGuestList;
        }
        else {
          this.loadGuests();
        }
      }
    });
  }

  onSubmit(): void {
    if (this.formGuests.valid) {
      const guest = {
        name: this.formGuests.value.name,
        email: this.formGuests.value.email,
        phone: this.formGuests.value.phone,
        document: this.formGuests.value.document,
      }
      
      if (this.updatedGuest) {
        const guestWithId = { 
          id: this.updatedGuest.id,
          ...guest
        }
        this.guestService.updateGuest(guestWithId).subscribe({
          next: () => {
            this.formGuests.reset();
            this.existingEmail = false;
            this.existingDocument = false;
  
            this.setAlert("success", "Hóspede Atualizado");
            this.loadGuests();
          },
          error: (error) => {
            this.existingEmail = error.email;
            this.existingDocument = error.document;
  
            this.setAlert("error", "Erro ao Atualizar Hóspede");
          }
        });
      }
      else {
        this.guestService.createGuest(guest).subscribe({
          next: () => {
            this.formGuests.reset();
            this.existingEmail = false;
            this.existingDocument = false;
  
            this.setAlert("success", "Hóspede Adicionado");
            this.loadGuests();
          },
          error: (error) => {
            this.existingEmail = error.email;
            this.existingDocument = error.document;
  
            this.setAlert("error", "Erro ao Adicionar Hóspede");
          }
        });
      }
      this.alertAll = false;
    }
    else {
      this.alertAll = true;
    }
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => this.guestList = guests
    });
  }

  setDeletedGuest(id: string): void {
    this.deletedGuest = id;
  }

  deleteGuest(): void {
    this.guestService.deleteGuest(this.deletedGuest).subscribe({
      next: () => {
        this.loadGuests();
        this.deletedGuest = "";
      },
      error: () => {
        this.alert.value = true;
        this.alert.type = "error";
        this.alert.message = "Hóspede Possui Reservas";
        setTimeout(() => {
          this.alert.value = false;
        }, 2000);
      }
    });
  }

  toggleUpdatedGuest(guest?: Guest): void {
    if (guest) {
      this.updatedGuest = guest;
      this.formGuests.setValue({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        document: guest.document
      });
    } else {
      this.updatedGuest = null;
      this.formGuests.reset();
    }
  }

  setAlert(type: string, message: string): void {
    this.alert.value = true;
    this.alert.type = type;
    this.alert.message = message;
    setTimeout(() => {
      this.alert.value = false;
    }, 2000);
  }

}