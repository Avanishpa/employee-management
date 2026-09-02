import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Attendance, AttendanceStatus } from '../../../shared/components/models/attendance.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { AttendanceService } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.scss'
})
export class MarkAttendanceComponent {
 employees: any[] = [];

  selectedDate: string = '';

  attendanceStatus: {
    [employeeId: number]: AttendanceStatus
  } = {};

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {

    // Set today's date
    this.selectedDate =
      new Date().toISOString().split('T')[0];

    this.loadEmployees();

    this.loadExistingAttendance();

  }

  // Load Employees

  loadEmployees(): void {

    this.employees =
      this.employeeService.getEmployees();

  }

  // Load attendance for selected date

  loadExistingAttendance(): void {

    const existingAttendance =
      this.attendanceService.getAttendanceByDate(
        this.selectedDate
      );

    // Default all employees to Present
    this.employees.forEach(employee => {

      const existingRecord =
        existingAttendance.find(
          attendance =>
            attendance.employeeId === employee.id
        );

      this.attendanceStatus[employee.id] =
        existingRecord
          ? existingRecord.status
          : 'Present';

    });

  }

  // When Date Changes

  onDateChange(): void {

    this.loadExistingAttendance();

  }

  // Save Attendance

  saveAttendance(): void {

    const records: Attendance[] =
      this.employees.map(employee => ({

        id: 0,

        employeeId: employee.id,

        employeeName: employee.name,

        department: employee.department,

        date: this.selectedDate,

        status:
          this.attendanceStatus[employee.id]

      }));

    this.attendanceService.saveAttendance(records);

    alert('Attendance Saved Successfully! 🎉');

  }
}
