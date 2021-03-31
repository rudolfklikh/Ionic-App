import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
	loadedOffers$: Observable<Array<Place>>;
	isLoading = false;

	constructor(private placesService: PlacesService, private router: Router) { }

	ngOnInit() {
		this.loadedOffers$ = this.placesService.places;
	}

	ionViewWillEnter() {
		this.isLoading = true;
		this.placesService.fetchPlaces().subscribe(() => this.isLoading = false);
	}

	onEdit(offerId: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit-offer', offerId]);
	}

}
