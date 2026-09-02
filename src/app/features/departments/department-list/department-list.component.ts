import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Department } from '../../../shared/components/models/department.model';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    FormsModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent {
  selectedDepartment: Department | null = null;

showDepartmentModal: boolean = false;
  // =========================
  // Department Data
  // =========================

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

  // =========================
  // Search
  // =========================

  searchText: string = '';

  // =========================
  // Pagination
  // =========================
 currentPage: number = 1;
  itemsPerPage: number = 5;

  // =========================
  // Sorting
  // =========================

  sortColumn: keyof Department | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

 
  // =========================
  // Load Departments
  // =========================

  loadDepartments(): void {

    this.departments = [
      ...this.departmentService.getDepartments()
    ];

    this.filteredDepartments = [
      ...this.departments
    ];
  }

  // =========================
  // Search Departments
  // =========================

  searchDepartments(): void {

    const search =
      this.searchText.toLowerCase().trim();

    this.filteredDepartments =
      this.departments.filter(department =>
        department.name.toLowerCase().includes(search) ||
        department.manager.toLowerCase().includes(search) ||
        department.description.toLowerCase().includes(search) ||
        department.status.toLowerCase().includes(search)
      );

    // Go back to page 1 after search
    this.currentPage = 1;

    this.applySorting();
  }

  // =========================
  // Sorting
  // =========================

  sort(column: keyof Department): void {

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

    this.filteredDepartments.sort((a, b) => {

      const column = this.sortColumn as keyof Department;

      const valueA = a[column];
      const valueB = b[column];

      let comparison = 0;

      if (
        typeof valueA === 'string' &&
        typeof valueB === 'string'
      ) {

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
  // Employee Count
  // =========================

  getEmployeeCount(departmentName: string): number {

    const employees =
      this.employeeService.getEmployees();

    return employees.filter(
      employee =>
        employee.department
          .toLowerCase()
          .trim() ===
        departmentName
          .toLowerCase()
          .trim()
    ).length;

  }

  // =========================
  // Pagination
  // =========================

  get totalPages(): number {

    return Math.ceil(
      this.filteredDepartments.length /
      this.itemsPerPage
    );

  }

  get paginatedDepartments(): Department[] {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    return this.filteredDepartments.slice(
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

  // =========================
  // Change Page Size
  // =========================

  changePageSize(): void {

    this.currentPage = 1;

  }

  // =========================
  // Delete Department
  // =========================

  deleteDepartment(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this department?'
    );

    if (confirmDelete) {

      this.departmentService.deleteDepartment(id);

      this.loadDepartments();

      // Fix current page after delete
      if (
        this.currentPage > this.totalPages &&
        this.totalPages > 0
      ) {

        this.currentPage =
          this.totalPages;

      }

    }

  }
  viewDepartment(department: Department): void {

  this.selectedDepartment = department;

  this.showDepartmentModal = true;

}
closeDepartmentModal(): void {

  this.showDepartmentModal = false;

  this.selectedDepartment = null;

}
}
