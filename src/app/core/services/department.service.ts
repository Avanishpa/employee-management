import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { Department } from '../../shared/components/models/department.model';

import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
private readonly STORAGE_KEY = 'departments';

  private departments: Department[] = [];

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(this.platformId);

    this.loadFromLocalStorage();

    // Add dummy data only when browser storage is empty
    if (
      this.isBrowser &&
      this.departments.length === 0
    ) {

      this.departments = [

        {
          id: 1,
          name: 'IT',
          manager: 'Rahul Sharma',
          description:
            'Information Technology Department',
          status: 'Active'
        },

        {
          id: 2,
          name: 'HR',
          manager: 'Priya Patel',
          description:
            'Human Resources Department',
          status: 'Active'
        },

        {
          id: 3,
          name: 'Finance',
          manager: 'Amit Kumar',
          description:
            'Finance and Accounting Department',
          status: 'Active'
        },

        {
          id: 4,
          name: 'Marketing',
          manager: 'Neha Shah',
          description:
            'Marketing and Sales Department',
          status: 'Inactive'
        }

      ];

      this.saveToLocalStorage();
    }
  }

  // =========================
  // LOAD FROM LOCAL STORAGE
  // =========================

  private loadFromLocalStorage(): void {

    if (!this.isBrowser) {
      return;
    }

    const savedData =
      localStorage.getItem(this.STORAGE_KEY);

    if (savedData) {

      try {

        this.departments =
          JSON.parse(savedData);

      } catch (error) {

        console.error(
          'Error reading departments:',
          error
        );

        this.departments = [];

      }

    }

  }

  // =========================
  // SAVE TO LOCAL STORAGE
  // =========================

  private saveToLocalStorage(): void {

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.departments)
    );

  }

  // =========================
  // GET ALL DEPARTMENTS
  // =========================

  getDepartments(): Department[] {

    return [...this.departments];

  }

  // =========================
  // GET BY ID
  // =========================

  getDepartmentById(
    id: number
  ): Department | undefined {

    return this.departments.find(
      department =>
        department.id === id
    );

  }

  // =========================
  // ADD
  // =========================

  addDepartment(
    department: Department
  ): void {

    const newId =
      this.departments.length > 0
        ? Math.max(
            ...this.departments.map(
              department => department.id
            )
          ) + 1
        : 1;

    department.id = newId;

    this.departments.push(department);

    this.saveToLocalStorage();

  }

  // =========================
  // UPDATE
  // =========================

  updateDepartment(
    updatedDepartment: Department
  ): void {

    const index =
      this.departments.findIndex(
        department =>
          department.id ===
          updatedDepartment.id
      );

    if (index !== -1) {

      this.departments[index] =
        updatedDepartment;

      this.saveToLocalStorage();

    }

  }

  // =========================
  // DELETE
  // =========================

  deleteDepartment(
    id: number
  ): void {

    this.departments =
      this.departments.filter(
        department =>
          department.id !== id
      );

    this.saveToLocalStorage();

  }

}
