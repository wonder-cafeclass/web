import {  Component, OnInit }      from '@angular/core';
import { ImageService }            from '../../util/image.service';

@Component({
  moduleId: module.id,
  selector: 'simple-clock',
  templateUrl: 'clock.component.html',
  styleUrls: [ 'clock.component.css' ]
})
export class ClockComponent implements OnInit {

  clock1hrUrl:string;
  clock2hrUrl:string;
  clock3hrUrl:string;
  clockBGUrl:string;

  constructor(
    public imageService: ImageService
  ) {}

  ngOnInit(): void {

    // Do something
    this.clock1hrUrl = this.imageService.get(this.imageService.clock1hrUrl);
    this.clock2hrUrl = this.imageService.get(this.imageService.clock2hrUrl);
    this.clock3hrUrl = this.imageService.get(this.imageService.clock3hrUrl);
    this.clockBGUrl = this.imageService.get(this.imageService.clockBGUrl);

    console.log("TEST / this.clock1hrUrl ::: ",this.clock1hrUrl);
    console.log("TEST / this.clock2hrUrl ::: ",this.clock2hrUrl);
    console.log("TEST / this.clock3hrUrl ::: ",this.clock3hrUrl);
    console.log("TEST / this.clockBGUrl ::: ",this.clockBGUrl);
  }
}