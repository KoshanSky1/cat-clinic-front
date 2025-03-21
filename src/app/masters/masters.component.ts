import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ErrorService} from './error.service';

@Component({
  selector: 'app-masters',
  standalone: true,
  templateUrl: './masters.component.html',
  imports: [
    NgForOf,
    NgStyle,
    FormsModule,
    NgIf
  ],
  styleUrl: './masters.component.css'
})

export class MastersComponent implements OnInit {
  masters: any[] = [];
  details: any[] = [];

  master: any;
  detail: any;

  isTopNavButtonSelected = false;
  isContactsSelected = false;
  isCreateMasterFormOpen = false;
  isUpdateMasterFormOpen = false;
  isDetailsListOpen = false;
  isCreateDetailFormOpen = false;
  isUpdateDetailFormOpen = false;
  isConfirmDeleteMasterFormOpen = false;
  isConfirmDeleteDetailFormOpen = false

  number: number | undefined;
  date = "";
  description = "";

  name = "";
  amount: number | undefined;

  selectedMasterId = 0;
  selectedDetailId = 0;

  constructor(private http: HttpClient, private errorService: ErrorService) {

  }

  ngOnInit(): void {
    this.loadAllMasters();
  }

  loadAllMasters(): void {
    this.http.get<any>("http://localhost:8080/masters").subscribe(
      {
        next: ((response: any) => {
          this.masters = response;
        }),
        error: (error => {
          console.log(error);
        })
      }
    )
  }

  openCreateMasterForm() {
    this.isCreateMasterFormOpen = true;
  }

  closeCreateMasterForm() {
    this.isCreateMasterFormOpen = false;
  }

  createMaster() {
    const data = {number: this.number, date: this.date, description: this.description};
    const body = JSON.stringify(data);

    if (data.number == null || data.date == null || data.description == null) {
      console.error("Данные не могут быть пустыми");
      return;
    }
    this.http.post<any>("http://localhost:8080/masters", body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.closeCreateMasterForm();
        this.loadAllMasters();
      },
      error: (error) => {
        let errorMessage = "Произошла ошибка. Пожалуйста, введите корректные данные";
        if (error.status === 400) {
          errorMessage = error.error.message || "Ошибка валидации. Номер должен быть больше 0. Все поля должны быть заполнены";
        }
        if (error.status === 409) {
          errorMessage = error.error.message || "Номер документа " + this.number + " уже существует";
        }
        console.log(error);
        this.errorService.openErrorDialog(errorMessage);
      }
    });
  }

  openUpdateMasterForm() {
    this.onMasterSelected(this.selectedMasterId);
    this.isUpdateMasterFormOpen = true;
  }

  closeUpdateMasterForm() {
    this.isUpdateMasterFormOpen = false;
  }

  updateMaster() {
    const data = {number: this.number, date: this.date, description: this.description};
    const body = JSON.stringify(data);

    this.http.patch<any>("http://localhost:8080/masters/" + this.selectedMasterId, body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe(
      {
        next: ((response: any) => {
          console.log(response);
          this.closeUpdateMasterForm();
          this.loadAllMasters();
        }),
        error: (error) => {
          let errorMessage = "Произошла ошибка. Пожалуйста, попробуйте позже";
          if (error.status === 400) {
            errorMessage = error.error.message || "Описание документа не может состоять только из пробелов";
          }
          if (error.status === 409) {
            errorMessage = error.error.message || "Номер документа " + this.number + " уже существует";
          }
          console.log(error);
          this.errorService.openErrorDialog(errorMessage);
        }
      })
  }

  openDetailsList() {
    this.isDetailsListOpen = true;
    this.loadAllDetailsByMasterId();
  }

  closeDetailsList() {
    this.isDetailsListOpen = false;
  }

  loadAllDetailsByMasterId(): void {
    this.onMasterSelected(this.selectedMasterId);

    this.http.get<any>("http://localhost:8080/details/" + this.selectedMasterId).subscribe(
      {
        next: ((response: any) => {
          this.details = response;
        }),
        error: (error => {
          console.log(error);
        })
      }
    )
  }

  openCreateDetailForm() {
    this.isCreateDetailFormOpen = true;
  }

  closeCreateDetailForm() {
    this.isCreateDetailFormOpen = false;
  }

  createDetail() {
    const data = {name: this.name, amount: this.amount};
    const body = JSON.stringify(data);

    if (data.name == null || data.amount == null) {
      console.error("Данные не могут быть пустыми");
      return;
    }
    this.http.post<any>("http://localhost:8080/details/" + this.selectedMasterId, body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe(
      {
        next: ((response: any) => {
          console.log(response);
          this.closeCreateDetailForm();
          this.loadAllMasters();
          this.loadAllDetailsByMasterId();
        }),
        error: (error) => {
          let errorMessage = "Произошла ошибка. Пожалуйста, введите корректные данные";
          if (error.status === 400) {
            errorMessage = error.error.message || "Ошибка валидации. Наименование не может быть пустым, сумма не может быть отрицательной";
          }
          if (error.status === 409) {
            errorMessage = error.error.message || "Наименование спецификации " + this.name + " уже существует";
          }
          console.log(error);
          this.errorService.openErrorDialog(errorMessage);
        }
      }
    )
  }

  deleteMaster() {
    if (this.selectedMasterId == null) {
      console.error("Выберите документ для удаления");
      return;
    }
    this.http.delete("http://localhost:8080/masters/" + this.selectedMasterId)
      .subscribe({
        next: (response) => {
          console.log("Документ удален", response);
          this.closeDeleteMasterForm();
          this.loadAllMasters();
        },
        error: (error) => {
          console.error("Ошибка при удалении документа", error);
        }
      });
  }

  deleteDetail() {
    if (this.selectedDetailId == null) {
      console.error("Выберите спецификацию для удаления");
      return;
    }
    this.http.delete("http://localhost:8080/details/" + this.selectedDetailId)
      .subscribe({
        next: (response) => {
          console.log("Спецификация удалена", response);
          this.closeDeleteDetailForm();
          this.loadAllMasters();
          this.loadAllDetailsByMasterId();
        },
        error: (error) => {
          console.error("Ошибка при удалении спецификации", error);
        }
      });
  }

  openUpdateDetailForm() {
    this.onDetailSelected(this.selectedDetailId);
    this.isUpdateDetailFormOpen = true;
  }

  closeUpdateDetailForm() {
    this.isUpdateDetailFormOpen = false;
  }

  updateDetail() {
    const data = {name: this.name, amount: this.amount};
    const body = JSON.stringify(data);

    this.http.patch<any>("http://localhost:8080/details/" + this.selectedDetailId, body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).subscribe(
      {
        next: ((response: any) => {
          console.log(response);
          this.closeUpdateDetailForm();
          this.loadAllMasters();
          this.loadAllDetailsByMasterId();
        }),
        error: (error) => {
          let errorMessage = "Произошла ошибка. Пожалуйста, попробуйте позже";
          if (error.status === 400) {
            errorMessage = error.error.message || "Ошибка валидации. Наименование не может состоять только из пробелов, сумма не может быть отрицательной";
          }
          if (error.status === 409) {
            errorMessage = error.error.message || "Наименование спецификации " + this.name + " уже существует";
          }
          console.log(error);
          this.errorService.openErrorDialog(errorMessage);
        }
      })

  }

  private formatAmount(value: number | string): string {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(amount) ? '0.00' : amount.toFixed(2);
  }

  addNonBreakingSpaces(value: string | number, length: number, alignRight = false): string {
    const str = value.toString();
    const spacesNeeded = Math.max(0, length - str.length);
    const spaces = '&nbsp;'.repeat(spacesNeeded);

    return str + spaces;
  }

  formatMaster(master: any): string {
    const numberStr = this.addNonBreakingSpaces(master.number, 10);
    const dateStr = this.addNonBreakingSpaces(master.date, 12);
    const amountStr = this.addNonBreakingSpaces(this.formatAmount(master.amount), 10);
    return ` ${numberStr}  ${dateStr}  ${amountStr}`;
  }

  formatDetail(detail: any): string {
    const nameStr = this.addNonBreakingSpaces(detail.name, 15);
    const amountStr = this.addNonBreakingSpaces(this.formatAmount(detail.amount), 10);
    return ` ${nameStr}  ${amountStr}`;
  }

  getMasterById(masterId: number): void {
    this.http.get<any>("http://localhost:8080/masters/" + masterId).subscribe(
      {
        next: ((response: any) => {
          this.master = response;
        }),
        error: (error => {
          console.log(error);
        })
      }
    )
  }

  onMasterSelected(masterId: number) {
    this.getMasterById(masterId);
  }

  openDeleteMasterForm() {
    this.onMasterSelected(this.selectedMasterId);
    this.isConfirmDeleteMasterFormOpen = true;
  }

  closeDeleteMasterForm() {
    this.isConfirmDeleteMasterFormOpen = false;
  }

  getDetailById(detailId: number): void {
    this.http.get<any>("http://localhost:8080/details/" + this.selectedMasterId + "/" + detailId).subscribe(
      {
        next: ((response: any) => {
          this.detail = response;
        }),
        error: (error => {
          console.log(error);
        })
      }
    )
  }

  onDetailSelected(detailId: number) {
    this.getDetailById(detailId);
  }

  openDeleteDetailForm() {
    this.onDetailSelected(this.selectedDetailId);
    this.isConfirmDeleteDetailFormOpen = true;
  }

  closeDeleteDetailForm() {
    this.isConfirmDeleteDetailFormOpen = false;
  }

  openStub() {
    this.isTopNavButtonSelected = true;
  }

  closeStub() {
    this.isTopNavButtonSelected = false;
  }

  openMap() {
    this.isContactsSelected = true;
  }

  closeMap() {
    this.isContactsSelected = false;
  }

  calculateTotalAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  get totalMastersAmount(): string {
    return this.formatAmount(this.calculateTotalAmount(this.masters));
  }

  get totalDetailsAmount(): string {
    return this.formatAmount(this.calculateTotalAmount(this.details));
  }

}
