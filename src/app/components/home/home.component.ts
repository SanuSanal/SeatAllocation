import { Component, OnInit } from '@angular/core';
import { SeatAllocationService } from '../../services/seat-allocation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public employeeObj;
  public resultObj;
  public employeeExist;
  public seatAvl;
  public updateMode;
  employeeForm: FormGroup;
  validationMsg: String = "";
  constructor(private seatAllocation: SeatAllocationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeEmptyForm();
    if (this.route.snapshot.params.id != undefined) {
      this.updateMode = true;
      this.seatAllocation.getEmployee(this.route.snapshot.params.id).subscribe(
        data => {
          this.employeeObj = data;
          this.initializeForm();
          return true;
        },
        error => {
          console.log(error);
          return false;
        }
      );
    } else {
      this.updateMode = false;
      this.initializeEmptyForm();
    }
  }

  initializeForm() {
    this.employeeForm = new FormGroup({
      employeeId: new FormControl(this.employeeObj.employeeUid, Validators.required),
      employeeName: new FormControl(this.employeeObj.employeeName, Validators.required),
      designation: new FormControl(this.employeeObj.designation, Validators.required),
      floor: new FormControl(this.employeeObj.seats.seatsPk.floor, Validators.required),
      seatNo: new FormControl(this.employeeObj.seats.seatsPk.seatNo, Validators.required),
      isManager: new FormControl(this.employeeObj.seats.managersSeat, Validators.required)
    });
    this.observers();
  }

  initializeEmptyForm() {
    this.employeeForm = new FormGroup({
      employeeId: new FormControl('', Validators.required),
      employeeName: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      floor: new FormControl('', Validators.required),
      seatNo: new FormControl('', Validators.required),
      isManager: new FormControl()
    });
    this.observers();
  }

  saveEmployee() {
    if (this.employeeForm.valid) {
      if (!this.employeeExist && !this.seatAvl) {
        let empObj = this.createEmployeeObj(this.employeeForm.value);
        if (!this.updateMode) {
          this.seatAllocation.saveEmployee(empObj).subscribe(
            (data: Response) => {
              this.employeeForm.reset({}, {emitEvent : false, onlySelf : true});
              this.resultObj = data;
              this.validationMsg = this.resultObj.message;
              return true;
            },
            error => {
              console.log(error);
              this.validationMsg = this.resultObj.message;
              return false;
            }
          );
        } else {
          this.seatAllocation.updateEmployee(empObj).subscribe(
            (data: Response) => {
              this.employeeForm.reset({}, {emitEvent : true, onlySelf : true});
              this.resultObj = data;
              this.validationMsg = this.resultObj.message;
              return true;
            },
            error => {
              console.log(error);
              this.validationMsg = this.resultObj.message;
              return false;
            }
          );
        }
      } else {
        this.validationMsg = "Employee or Seat details is not valid";
      }
    } else {
      this.validationMsg = "Enter all details..";
    }
  };

  createEmployeeObj(formData) {
    let empObj = {
      "employeeUid": formData.employeeId,
      "employeeName": formData.employeeName,
      "designation": formData.designation,
      "seats": {
        "managersSeat": formData.isManager,
        "seatsPk": {
          "employeeUid": formData.employeeId,
          "floor": formData.floor,
          "seatNo": formData.seatNo
        }
      }
    };
    return empObj;
  };

  checkEmployeePresent() {
    let employeeId = this.employeeForm.value.employeeId;
    if (employeeId != null && employeeId != "" ) {
      this.seatAllocation.checkEmployeeExists(employeeId).subscribe(
        data => {
          this.employeeExist = data;
          if (this.employeeExist) {
            this.validationMsg = "Employee with the id already exists!!";
          } else {
            this.validationMsg = "";
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  checkSeatAvl() {
    if (this.employeeForm.value.floor != null && this.employeeForm.value.floor != ''
      && this.employeeForm.value.seatNo != null && this.employeeForm.value.seatNo != '') {
      let seatObj = {
        "managersSeat": this.employeeForm.value.isManager,
        "seatsPk": {
          "employeeUid": this.employeeForm.value.employeeId,
          "floor": this.employeeForm.value.floor,
          "seatNo": this.employeeForm.value.seatNo
        }
      }
      console.log(seatObj);
      
      this.seatAllocation.checkSeatAVailable(seatObj).subscribe(
        data => {
          this.resultObj = data;
          if (this.resultObj.data == 0) {
            this.seatAvl = this.resultObj.dataVal;
            if (this.seatAvl) {
              this.validationMsg = "Selected seat has been already allocated!!";
            } else {
              this.validationMsg = "";
            }
          } else {
            this.validationMsg = this.resultObj.dataVal;
          }
          return true;
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }
  };
  observers() {
    this.employeeForm.get("floor").valueChanges.subscribe(selectedValue => {
      if (selectedValue !=  null) {
        this.checkSeatAvl(); 
      }
    });
    this.employeeForm.get("seatNo").valueChanges.subscribe(selectedValue => {
      if (selectedValue !=  null) {
        this.checkSeatAvl(); 
      }
    });
    this.employeeForm.get("isManager").valueChanges.subscribe(selectedValue => {
      if (selectedValue !=  null) {
        this.checkSeatAvl(); 
      }
    });
    this.employeeForm.get("employeeId").valueChanges.subscribe(selectedValue => {
      if (selectedValue != null) {
        this.checkEmployeePresent();
      }
    });
  }
}
