export class StudentModel{
    studentId: number;
    name: string;
    city: string;
    state: string;
    emailId: string;
    contactNo: string;
    address: string;
    pinCode: string;

    constructor() {
        this.studentId = 0;
        this.name = '';
        this.city = '';
        this.state = '';
        this.emailId = '';
        this.contactNo = '';
        this.address = '';
        this.pinCode = '';
    }
}