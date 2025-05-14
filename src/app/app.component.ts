import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentModel } from './model/Student';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular18_crud_app';

  studentForm: FormGroup = new FormGroup({});
  studentObj: StudentModel = new StudentModel();
  studentList: StudentModel[] = [];
  searchText: string = '';

  constructor() {
    this.createForm()
    const oldData = localStorage.getItem("StudentData");
    if(oldData != null) {
      const parseData = JSON.parse(oldData);
      this.studentList = parseData;
    }
  }

  reset() {
    this.studentObj = new StudentModel();
    this.studentObj.studentId = 0;
    this.createForm();
  }

  createForm() {
    this.studentForm = new FormGroup({
      studentId: new FormControl(this.studentObj.studentId),
      name: new FormControl(this.studentObj.name,[Validators.required]),
      city: new FormControl(this.studentObj.city),
      state: new FormControl(this.studentObj.state),
      address: new FormControl(this.studentObj.address),
      contactNo: new FormControl(this.studentObj.contactNo),
      emailId: new FormControl(this.studentObj.emailId),
      pinCode: new FormControl(this.studentObj.pinCode,[Validators.required,Validators.minLength(6)])
    })
  }

  onSave() {
    const oldData = localStorage.getItem("StudentData");
    const oldNextId = localStorage.getItem("NextStudentId");
    
    // If there is old data.
    if(oldData != null && oldNextId != null) {
      const parseData = JSON.parse(oldData);
      this.studentList = parseData;
      this.studentForm.controls['studentId'].setValue(oldNextId);
      const newId = 1 + parseInt(oldNextId);
      this.studentList.unshift(this.studentForm.value);
      localStorage.setItem("NextStudentId", newId.toString());
    } else { // else if there is no old data, this should only run once.
      let newNextId = 1;
      this.studentForm.controls['studentId'].setValue(newNextId);
      this.studentList.unshift(this.studentForm.value);
      newNextId++;
      localStorage.setItem("NextStudentId", newNextId.toString());
    }

    localStorage.setItem("StudentData", JSON.stringify(this.studentList))
    this.reset();

    this.totalPages = Math.ceil(this.studentList.length / this.itemsPerPage);
    this.updatePage();
  }

  onEdit(item: StudentModel) {
    this.studentObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.studentList.find(studenti=>studenti.studentId == this.studentForm.controls['studentId'].value);
    if(record != undefined) {
      record.address = this.studentForm.controls['address'].value;
      record.name = this.studentForm.controls['name'].value;
      record.contactNo = this.studentForm.controls['contactNo'].value;
      record.city = this.studentForm.controls['city'].value;
      record.state = this.studentForm.controls['state'].value;
      record.emailId = this.studentForm.controls['emailId'].value;
      record.pinCode = this.studentForm.controls['pinCode'].value;
    }
    localStorage.setItem("StudentData", JSON.stringify(this.studentList));
    this.reset();
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete?");
    if(isDelete) {


      const index = this.studentList.findIndex(studenti=>studenti.studentId === id);
      if(index !== -1) {
        this.studentList.splice(index, 1);
      }
      localStorage.setItem("StudentData", JSON.stringify(this.studentList));
    }
    this.totalPages = Math.ceil(this.studentList.length / this.itemsPerPage);
    this.updatePage();
  }

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  filteredList: StudentModel[] = [];
  
  ngOnInit() {
    this.filteredList = this.studentList.slice(0, this.itemsPerPage);
    this.totalPages = Math.ceil(this.studentList.length / this.itemsPerPage);
  }
  
  onSearch() {
    if (this.searchText.trim() === '') {
      this.updatePage();
    } else {
      this.filteredList = this.studentList.filter((student) =>
        Object.values(student).some((val) =>
          String(val).toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }
  }
  
  sort(field: keyof StudentModel) {
    this.studentList.sort((a, b) =>
      a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0
    );
    this.onSearch();
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }
  
  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredList = this.studentList.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  exportToCSV() {
    const csvData = Papa.unparse(this.studentList);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    link.click();
  }


}
