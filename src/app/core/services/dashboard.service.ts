import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { DepartmentService } from './department.service';
import { AttendanceService } from './attendance.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private attendanceService: AttendanceService
  ) {}

  // =========================
  // TOTAL EMPLOYEES
  // =========================

  getTotalEmployees(): number {

    return this.employeeService
      .getEmployees()
      .length;

  }


  // =========================
  // TOTAL DEPARTMENTS
  // =========================

  getTotalDepartments(): number {

    return this.departmentService
      .getDepartments()
      .length;

  }


  // =========================
  // TODAY ATTENDANCE
  // =========================

  getTodayAttendance() {

    const today =
      new Date()
        .toISOString()
        .split('T')[0];

    return this.attendanceService
      .getAttendanceByDate(today);

  }


  // =========================
  // PRESENT
  // =========================

  getPresentToday(): number {

    return this.getTodayAttendance()
      .filter(
        attendance =>
          attendance.status === 'Present'
      )
      .length;

  }


  // =========================
  // ABSENT
  // =========================

  getAbsentToday(): number {

    return this.getTodayAttendance()
      .filter(
        attendance =>
          attendance.status === 'Absent'
      )
      .length;

  }


  // =========================
  // LATE
  // =========================

  getLateToday(): number {

    return this.getTodayAttendance()
      .filter(
        attendance =>
          attendance.status === 'Late'
      )
      .length;

  }


  // =========================
  // WORK FROM HOME
  // =========================

  getWorkFromHomeToday(): number {

    return this.getTodayAttendance()
      .filter(
        attendance =>
          attendance.status ===
          'Work From Home'
      )
      .length;

  }


  // =========================
  // DEPARTMENT-WISE EMPLOYEES
  // =========================

  getDepartmentEmployeeData() {

    const employees =
      this.employeeService.getEmployees();

    const departments =
      this.departmentService.getDepartments();

    return departments.map(department => {

      const employeeCount =
        employees.filter(
          employee =>
            employee.department ===
            department.name
        ).length;

      return {

        department:
          department.name,

        count:
          employeeCount

      };

    });

  }
  // ========================================
// GET RECENT EMPLOYEES
// ========================================

getRecentEmployees(limit: number = 5) {

  const employees =
    this.employeeService.getEmployees();

  return employees
    .slice()
    .reverse()
    .slice(0, limit);

}
// ========================================
// WEEKLY ATTENDANCE DATA
// ========================================

getWeeklyAttendanceData() {

  const attendance =
    this.attendanceService.getAttendance();

  const days: string[] = [];

  const presentData: number[] = [];

  const absentData: number[] = [];

  const lateData: number[] = [];

  const workFromHomeData: number[] = [];


  for (let i = 6; i >= 0; i--) {

    const date = new Date();

    date.setDate(
      date.getDate() - i
    );


    const formattedDate =
      date.toISOString()
        .split('T')[0];


    days.push(

      date.toLocaleDateString(
        'en-US',
        {
          weekday: 'short'
        }
      )

    );


    const dayAttendance =
      attendance.filter(
        item =>
          item.date === formattedDate
      );


    presentData.push(

      dayAttendance.filter(
        item =>
          item.status === 'Present'
      ).length

    );


    absentData.push(

      dayAttendance.filter(
        item =>
          item.status === 'Absent'
      ).length

    );


    lateData.push(

      dayAttendance.filter(
        item =>
          item.status === 'Late'
      ).length

    );


    workFromHomeData.push(

      dayAttendance.filter(
        item =>
          item.status === 'Work From Home'
      ).length

    );

  }


  return {

    days,

    presentData,

    absentData,

    lateData,

    workFromHomeData

  };

}
}
