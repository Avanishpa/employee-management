export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Work From Home';

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  date: string;
  status: AttendanceStatus;
}