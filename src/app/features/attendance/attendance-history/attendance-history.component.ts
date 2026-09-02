import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Attendance } from '../../../shared/components/models/attendance.model';
import { AttendanceService } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [ CommonModule,
    FormsModule],
  templateUrl: './attendance-history.component.html',
  styleUrl: './attendance-history.component.scss'
})
export class AttendanceHistoryComponent {
 // =========================
  // DATA
  // =========================

  attendanceRecords: Attendance[] = [];
  filteredRecords: Attendance[] = [];

  // =========================
  // FILTERS
  // =========================

  searchText: string = '';
  selectedDate: string = '';
  selectedStatus: string = '';

  // =========================
  // SORTING
  // =========================

  sortColumn: keyof Attendance | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // =========================
  // PAGINATION
  // =========================

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  // =========================
  // LOAD ATTENDANCE
  // =========================

  loadAttendance(): void {

    this.attendanceRecords =
      this.attendanceService.getAttendance();

    this.applyFilters();

  }

  // =========================
  // FILTERS
  // =========================

  applyFilters(): void {

    this.filteredRecords =
      this.attendanceRecords.filter(record => {

        const searchMatch =
          !this.searchText ||
          record.employeeName
            .toLowerCase()
            .includes(
              this.searchText.toLowerCase()
            ) ||
          record.department
            .toLowerCase()
            .includes(
              this.searchText.toLowerCase()
            );

        const dateMatch =
          !this.selectedDate ||
          record.date === this.selectedDate;

        const statusMatch =
          !this.selectedStatus ||
          record.status === this.selectedStatus;

        return (
          searchMatch &&
          dateMatch &&
          statusMatch
        );

      });

    this.currentPage = 1;

    this.applySorting();

  }

  // =========================
  // CLEAR FILTERS
  // =========================

  clearFilters(): void {

    this.searchText = '';
    this.selectedDate = '';
    this.selectedStatus = '';

    this.applyFilters();

  }

  // =========================
  // SORTING
  // =========================

  sort(column: keyof Attendance): void {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

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

    this.filteredRecords.sort((a, b) => {

      const column =
        this.sortColumn as keyof Attendance;

      const valueA = a[column];
      const valueB = b[column];

      let comparison = 0;

      if (
        typeof valueA === 'string' &&
        typeof valueB === 'string'
      ) {

        comparison =
          valueA.localeCompare(valueB);

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
  // PAGINATION
  // =========================

  get totalPages(): number {

    return Math.ceil(
      this.filteredRecords.length /
      this.itemsPerPage
    );

  }

  get paginatedRecords(): Attendance[] {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    return this.filteredRecords.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );

  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }

  changePage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {
      this.currentPage = page;
    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }

  }

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {
      this.currentPage++;
    }

  }

  changePageSize(): void {

    this.currentPage = 1;

  }

  // =========================
  // STATISTICS
  // =========================

  get totalRecords(): number {
    return this.filteredRecords.length;
  }

  get presentCount(): number {

    return this.filteredRecords.filter(
      record => record.status === 'Present'
    ).length;

  }

  get absentCount(): number {

    return this.filteredRecords.filter(
      record => record.status === 'Absent'
    ).length;

  }

  get lateCount(): number {

    return this.filteredRecords.filter(
      record => record.status === 'Late'
    ).length;

  }

  get wfhCount(): number {

    return this.filteredRecords.filter(
      record =>
        record.status === 'Work From Home'
    ).length;

  }
}
