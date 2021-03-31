import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces$: Observable<Array<Place>>;
  listedLoadedPlaces$: Observable<Array<Place>>;
  relevantPlaces$: Observable<Array<Place>>;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadedPlaces$ = this.placesService.places;
	 this.relevantPlaces$ = this.loadedPlaces$;
    this.listedLoadedPlaces$ = this.relevantPlaces$.pipe(map(places => places.slice(1)));
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);

	 if (event.detail.value === 'all') {
		 this.relevantPlaces$ = this.loadedPlaces$;
		 this.listedLoadedPlaces$ = this.relevantPlaces$.pipe(map(places => places.slice(1)));
	 } else {
		 this.relevantPlaces$ =  this.loadedPlaces$.pipe(
			 map(places => {
				 console.log(places.filter(place => place.userId !== this.authService.userId));
				return places.filter(place => place.userId !== this.authService.userId)
			 })
		);
		console.log(this.relevantPlaces$.subscribe(pl => console.log(pl)));
		this.listedLoadedPlaces$ = this.relevantPlaces$.pipe(map(places => places.slice(1)));
	 }
  }

}
