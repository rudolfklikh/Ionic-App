import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { map, switchMap } from 'rxjs/operators';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place$: Observable<Place>;


  constructor(
    private router: Router, 
    private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private placesService: PlacesService,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {
    this.place$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('placeId')),
      switchMap(id => of(this.placesService.getSinglePlace(id)))
    );
  }


  onBookPlace() {
    this.modalCtrl
    .create({component: CreateBookingComponent, componentProps: {selectedPlace$: this.place$ }})
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);

      if(resultData.role === 'confirm') {
        console.log('Booked !!!');
      }
    });
  }

}
