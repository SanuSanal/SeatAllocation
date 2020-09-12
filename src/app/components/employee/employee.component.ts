import { Component, OnInit } from '@angular/core';
import { SeatAllocationService } from '../../services/seat-allocation.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  public employees;

  constructor(private seatAllocation: SeatAllocationService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.seatAllocation.getEmployees().subscribe(
      data => (this.employees = data),
      err => console.log(err),
      () => console.log('employees loaded')
    );
  }

}
