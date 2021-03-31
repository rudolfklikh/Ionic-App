import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { map, switchMap, tap, finalize } from 'rxjs/operators';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingsService } from '../../../bookings/bookings.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
	selector: 'app-place-detail',
	templateUrl: './place-detail.page.html',
	styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
	place$: Observable<Place>;
	isBookable = false;


	constructor(
		private router: Router,
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private placesService: PlacesService,
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private bookingService: BookingsService,
		private loadingCtrl: LoadingController,
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.place$ = this.route.paramMap.pipe(
			map(paramMap => paramMap.get('placeId')),
			switchMap(id => this.placesService.getSinglePlace(id)),
			tap(place => this.isBookable = place.userId !== this.authService.userId)
		);
	}


	onBookPlace(): void {
		this.actionSheetCtrl.create({
			header: 'Choose an Action',
			buttons: [
				{
					text: 'Select Date',
					handler: () => { this.openBookingModal('select') }
				},
				{
					text: 'Random Date',
					handler: () => { this.openBookingModal('random') }
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
		}).then(actionSheetEl => {
			actionSheetEl.present();
		});
	}


	private openBookingModal(mode: 'select' | 'random'): void {
		console.log(mode);

		this.modalCtrl
			.create({ component: CreateBookingComponent, componentProps: { selectedPlace$: this.place$, selectedMode: mode } })
			.then(modalEl => {
				modalEl.present();
				return modalEl.onDidDismiss();
			})
			.then(resultData => {
				console.log(resultData.data, resultData.role);

				if (resultData.role === 'confirm') {
					this.loadingCtrl.create({
						message: 'Booking place....'
					}).then(loadingEl => {
						loadingEl.present();
						this.place$.pipe(
							switchMap(place => {
								const data = resultData.data.bookingData;
								return this.bookingService.addBooking(
									place.id,
									place.title,
									place.imgUrl,
									data.firstName,
									data.lastName,
									data.guestNumber,
									data.startDate,
									data.endDate
								)
							})
						).subscribe(() => loadingEl.dismiss())
					})
				}
			});
	}

}
