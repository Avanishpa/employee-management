export interface Department {
  id: number;
  name: string;
  manager: string;
  description: string;
  status: 'Active' | 'Inactive';
}