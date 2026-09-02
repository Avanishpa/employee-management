import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';
import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';
import {
  EmployeeService
} from '../../core/services/employee.service';

import {
  DepartmentService
} from '../../core/services/department.service';

import {
  AttendanceService
} from '../../core/services/attendance.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ CommonModule,
    FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {


  employees: any[] = [];

  departments: any[] = [];

  attendanceRecords: any[] = [];

  filteredRecords: any[] = [];


  // ========================================
  // FILTERS
  // ========================================

  selectedEmployee = '';

  selectedDepartment = '';

  selectedStatus = '';

  selectedDate = '';


  constructor(

    private employeeService:
      EmployeeService,

    private departmentService:
      DepartmentService,

    private attendanceService:
      AttendanceService

  ) {}


  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {

    this.loadData();

  }


  // ========================================
  // LOAD DATA
  // ========================================

  loadData(): void {

    this.employees =
      this.employeeService.getEmployees();


    this.departments =
      this.departmentService.getDepartments();


    this.attendanceRecords =
      this.attendanceService.getAttendance();


    this.filteredRecords =
      [...this.attendanceRecords];

  }


  // ========================================
  // APPLY FILTERS
  // ========================================

  applyFilters(): void {

    this.filteredRecords =
      this.attendanceRecords.filter(
        record => {

          const employee =
            this.employees.find(
              emp =>
                emp.id === record.employeeId
            );


          // EMPLOYEE FILTER

          if (
            this.selectedEmployee &&
            record.employeeId !==
              Number(this.selectedEmployee)
          ) {
            return false;
          }


          // DEPARTMENT FILTER

          if (
            this.selectedDepartment &&
            employee?.department !==
              this.selectedDepartment
          ) {
            return false;
          }


          // STATUS FILTER

          if (
            this.selectedStatus &&
            record.status !==
              this.selectedStatus
          ) {
            return false;
          }


          // DATE FILTER

          if (
            this.selectedDate &&
            record.date !==
              this.selectedDate
          ) {
            return false;
          }


          return true;

        }
      );

  }


  // ========================================
  // CLEAR FILTERS
  // ========================================

  clearFilters(): void {

    this.selectedEmployee = '';

    this.selectedDepartment = '';

    this.selectedStatus = '';

    this.selectedDate = '';

    this.filteredRecords =
      [...this.attendanceRecords];

  }


  // ========================================
  // GET EMPLOYEE NAME
  // ========================================

  getEmployeeName(
    employeeId: number
  ): string {

    const employee =
      this.employees.find(
        emp =>
          emp.id === employeeId
      );

    return employee
      ? employee.name
      : 'Unknown';

  }


  // ========================================
  // GET EMPLOYEE DEPARTMENT
  // ========================================

  getEmployeeDepartment(
    employeeId: number
  ): string {

    const employee =
      this.employees.find(
        emp =>
          emp.id === employeeId
      );

    return employee
      ? employee.department
      : '-';

  }


  // ========================================
  // STATISTICS
  // ========================================

  get presentCount(): number {

    return this.filteredRecords.filter(
      record =>
        record.status === 'Present'
    ).length;

  }


  get absentCount(): number {

    return this.filteredRecords.filter(
      record =>
        record.status === 'Absent'
    ).length;

  }


  get lateCount(): number {

    return this.filteredRecords.filter(
      record =>
        record.status === 'Late'
    ).length;

  }


  get workFromHomeCount(): number {

    return this.filteredRecords.filter(
      record =>
        record.status ===
        'Work From Home'
    ).length;

  }
  // ========================================
// EXPORT TO EXCEL
// ========================================

exportToExcel(): void {

  const exportData =
    this.filteredRecords.map(
      record => ({

        Date: record.date,

        Employee:
          this.getEmployeeName(
            record.employeeId
          ),

        Department:
          this.getEmployeeDepartment(
            record.employeeId
          ),

        Status:
          record.status

      })
    );


  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    );


  const workbook =
    XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Attendance Report'
  );


  XLSX.writeFile(
    workbook,
    'attendance-report.xlsx'
  );

}
// ========================================
// EXPORT TO PDF
// ========================================

exportToPDF(): void {

  const doc =
    new jsPDF();


  // TITLE

  doc.setFontSize(18);

  doc.text(
    'Employee Attendance Report',
    14,
    20
  );


  // DATE

  doc.setFontSize(10);

  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    28
  );


  // TABLE DATA

  const tableData =
    this.filteredRecords.map(
      record => [

        record.date,

        this.getEmployeeName(
          record.employeeId
        ),

        this.getEmployeeDepartment(
          record.employeeId
        ),

        record.status

      ]
    );


  autoTable(doc, {

    startY: 35,

    head: [

      [
        'Date',
        'Employee',
        'Department',
        'Status'
      ]

    ],

    body: tableData,

    theme: 'grid',

    styles: {

      fontSize: 9,

      cellPadding: 4

    },

    headStyles: {

      fontStyle: 'bold'

    }

  });


  // SAVE FILE

  doc.save(
    'attendance-report.pdf'
  );

}

}