import { Injectable } from '@angular/core';
import { Employee } from '../Interface/Interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportServices {
private originalEmployees: Employee[] = [];
employees: Employee[] = [];
setEmployees(data: Employee[]) {
  this.originalEmployees = [...data];
  this.employees = [...data];
}

resetEmployees() {
  this.employees = [...this.originalEmployees];
}

getEmployees(): Employee[] {
  return this.employees;
}


  // Export to CSV
  exportToCSV(): void {
    debugger
    if (!this.employees.length) return;

    const headers = ['EMP ID', 'Name', 'Role', 'Project'];
    const rows = this.employees.map(emp => [
      `E${emp.empId}`,
      emp.name,
      emp.designation,
      emp.project
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employees.csv';
    link.click();
  }

  exportToExcel(): void {
  if (!this.employees.length) return;

  const worksheet = XLSX.utils.json_to_sheet(
    this.employees.map(emp => ({
      'EMP ID': `E${emp.empId}`,
      Name: emp.name,
      Role: emp.designation,
      Project: emp.project
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'employees.xlsx');
}

exportToPDF(employee: Employee): void {
  const doc = new jsPDF();
  console.log('Exporting to PDF:', employee);
  

  doc.setFontSize(16);
  doc.text('Employee Details', 14, 20);

  const safe = (val: any): string => {
    if (val === null || val === undefined || val === '') return '-';
    if (Array.isArray(val)) return val.length ? val.join(', ') : '-';
    if (typeof val === 'object') return JSON.stringify(val); // fallback
    return String(val);
  };

  const formattedDate = employee.doj ? new Date(employee.doj).toLocaleDateString() : '-';

  const details = [
    ['EMP ID', safe(`E${employee.empId}`)],
    ['Name', safe(employee.name)],
    ['Role', safe(employee.designation)],
    ['Project', safe(employee.project)],
    ['Email', safe(employee.email)],
    ['Location', safe(employee.location)],
    ['DOJ', formattedDate],
    ['Reporting To', safe(employee.reportingTo)],
    ['Billable', employee.billable ? 'Yes' : 'No'],
    ['Skill(s)', safe(employee.skill)],
    ['Remarks', safe(employee.remarks)]
  ];

  autoTable(doc, {
    startY: 30,
    head: [['Field', 'Value']],
    body: details
  });

  doc.save(`Employee_E${employee.empId || 'Unknown'}.pdf`);
}

}

