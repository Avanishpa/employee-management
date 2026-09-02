import { Employee } from './../../../shared/components/models/employee.model';
import { EmployeeService } from './../../../core/services/employee.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink , Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import JsBarcode from 'jsbarcode';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
 employees: Employee[] = [];
 searchText: string = '';

filteredEmployees: Employee[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  sortColumn: keyof Employee | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedEmployee: Employee | null = null;

showEmployeeModal: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private route:Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
  this.employees = this.employeeService.getEmployees();
  this.filteredEmployees = [...this.employees];
}

  deleteEmployee(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this employee?'
    );

    if (confirmDelete) {
      this.employeeService.deleteEmployee(id);
      this.loadEmployees();
    }
  }
   searchEmployees(): void {

    const search = this.searchText.toLowerCase().trim();

    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(search) ||
      employee.employeeId.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search) ||
      employee.designation.toLowerCase().includes(search)
    );

    // Reset to first page after search
    this.currentPage = 1;

    this.applySorting();
  }
  sort(column: keyof Employee): void {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc';

    } else {

      this.sortColumn = column;
      this.sortDirection = 'asc';

    }

    this.applySorting();
  }

  applySorting(): void {

    if (!this.sortColumn) {
      return;
    }

    this.filteredEmployees.sort((a, b) => {

      const column = this.sortColumn as keyof Employee;

      const valueA = a[column];
      const valueB = b[column];

      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {

        comparison = valueA.localeCompare(valueB);

      } else if (
        typeof valueA === 'number' &&
        typeof valueB === 'number'
      ) {

        comparison = valueA - valueB;

      }

      return this.sortDirection === 'asc'
        ? comparison
        : -comparison;

    });
  }

  // =========================
  // Pagination
  // =========================

  get totalPages(): number {

    return Math.ceil(
      this.filteredEmployees.length / this.itemsPerPage
    );

  }

  get paginatedEmployees(): Employee[] {

    const startIndex =
      (this.currentPage - 1) * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    return this.filteredEmployees.slice(
      startIndex,
      endIndex
    );

  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }

  changePage(page: number): void {

    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }

  }
//   viewEmployee(employee: Employee): void {

//   this.selectedEmployee = employee;

//   this.showEmployeeModal = true;

//   setTimeout(() => {
//     this.generateBarcode();
//   }, 100);

// }
viewEmployee(id: number): void {

  this.route.navigate([
    '/employee-profile',
    id
  ]);

}
closeModal(): void {

  this.showEmployeeModal = false;

  this.selectedEmployee = null;

}
generateBarcode(): void {

  if (!this.selectedEmployee) {
    return;
  }

  const barcodeElement =
  document.getElementById('employeeBarcode') as unknown as SVGSVGElement;

  if (barcodeElement) {

    JsBarcode(
      barcodeElement,
      this.selectedEmployee.employeeId,
      {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: true
      }
    );

  }

}
exportToExcel(): void {

  const exportData = this.filteredEmployees.map(employee => ({

    'Employee ID': employee.employeeId,

    'Name': employee.name,

    'Email': employee.email,

    'Phone': employee.phone,

    'Department': employee.department,

    'Designation': employee.designation,

    'Joining Date': employee.joiningDate,

    'Status': employee.status

  }));

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Employees'
  );

  XLSX.writeFile(
    workbook,
    'Employees.xlsx'
  );

}
exportToPDF(): void {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    'Employee Management System',
    14,
    20
  );

  doc.setFontSize(12);

  doc.text(
    'Employee List',
    14,
    28
  );

  const tableData = this.filteredEmployees.map(employee => [

    employee.employeeId,

    employee.name,

    employee.department,

    employee.designation,

    employee.email,

    employee.phone,

    employee.status

  ]);

  autoTable(doc, {

    startY: 35,

    head: [[
      'Employee ID',
      'Name',
      'Department',
      'Designation',
      'Email',
      'Phone',
      'Status'
    ]],

    body: tableData,

    styles: {
      fontSize: 8
    }

  });

  doc.save('Employees.pdf');

}
}
