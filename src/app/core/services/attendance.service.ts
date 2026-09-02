import { Injectable,Inject, PLATFORM_ID } from '@angular/core';
import { Attendance } from '../../shared/components/models/attendance.model';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

   private readonly STORAGE_KEY =
    'attendanceRecords';

  private attendanceRecords: Attendance[] = [];

  private isBrowser: boolean;


  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(this.platformId);

    // Only access LocalStorage in browser
    if (this.isBrowser) {

      this.loadFromLocalStorage();

    }

  }


  // =========================
  // LOAD FROM LOCALSTORAGE
  // =========================

  private loadFromLocalStorage(): void {

    // Extra protection
    if (!this.isBrowser) {
      return;
    }

    const savedData =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    if (savedData) {

      try {

        this.attendanceRecords =
          JSON.parse(savedData);

      } catch (error) {

        console.error(
          'Error loading attendance data',
          error
        );

        this.attendanceRecords = [];

      }

    }

  }


  // =========================
  // SAVE TO LOCALSTORAGE
  // =========================

  private saveToLocalStorage(): void {

    // Only run in browser
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(
        this.attendanceRecords
      )
    );

  }


  // =========================
  // GET ALL ATTENDANCE
  // =========================

  getAttendance(): Attendance[] {

    return [
      ...this.attendanceRecords
    ];

  }


  // =========================
  // GET ATTENDANCE BY DATE
  // =========================

  getAttendanceByDate(
    date: string
  ): Attendance[] {

    return this.attendanceRecords.filter(
      attendance =>
        attendance.date === date
    );

  }


  // =========================
  // SAVE ATTENDANCE
  // =========================

  saveAttendance(
    records: Attendance[]
  ): void {

    records.forEach(record => {

      const existingIndex =
        this.attendanceRecords.findIndex(
          attendance =>
            attendance.employeeId ===
              record.employeeId &&
            attendance.date ===
              record.date
        );


      // UPDATE EXISTING RECORD

      if (existingIndex !== -1) {

        record.id =
          this.attendanceRecords[
            existingIndex
          ].id;

        this.attendanceRecords[
          existingIndex
        ] = record;

      }


      // ADD NEW RECORD

      else {

        record.id =
          this.attendanceRecords.length > 0
            ? Math.max(
                ...this.attendanceRecords.map(
                  attendance =>
                    attendance.id
                )
              ) + 1
            : 1;

        this.attendanceRecords.push(
          record
        );

      }

    });


    // Save after updating records
    this.saveToLocalStorage();

  }


  // =========================
  // CLEAR ALL ATTENDANCE
  // =========================

  clearAllAttendance(): void {

    this.attendanceRecords = [];

    this.saveToLocalStorage();

  }

}
