import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SeatAllocationService {

  constructor(private http:HttpClient) { }

  getEmployees() {
    return this.http.get("/server/api/v1/seats/listAll")
  }

  saveEmployee(employee) {
    let body = JSON.stringify(employee);
    return this.http.post("/server/api/v1/seats/save", body, httpOptions);
  }

  updateEmployee(employee) {
    let body = JSON.stringify(employee);
    return this.http.put("/server/api/v1/seats/updateEmployee", body, httpOptions);
  }

  checkEmployeeExists(employeeId :Number) {
    return this.http.get("/server/api/v1/seats/employeePresent/"+employeeId);
  }

  checkSeatAVailable(seats) {
    let body = JSON.stringify(seats);
    return this.http.post("/server/api/v1/seats/seatAvailable", body, httpOptions);
  }

  getEmployee(employeeId :Number) {
    return this.http.get("/server/api/v1/seats/getEmployee/"+employeeId);
  }

  getConstants() {
    return this.http.get("/server/api/v1/seats/constants");
  }
}
