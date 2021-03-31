import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../place.model';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place$: Observable<Place>;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.place$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('placeId')),
      switchMap(id => this.placesService.getSinglePlace(id))
    );
  }

}
