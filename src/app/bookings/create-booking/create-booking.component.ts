import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace$: Observable<Place>;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit(): void {}

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace(): void {
    this.modalCtrl.dismiss({message: 'This is a dummy message!'}, 'confirm');
  }
}
