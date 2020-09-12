import { Component, OnInit } from '@angular/core';

import { SeatAllocationService} from './services/seat-allocation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public constants;

  constructor(private service : SeatAllocationService) {}

  ngOnInit(): void {
    this.service.getConstants().subscribe(
      data => this.constants = data,
      err => console.log(err)
    )
  }
  
}
