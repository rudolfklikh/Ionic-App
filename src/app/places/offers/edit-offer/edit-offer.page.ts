import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap, finalize, catchError } from 'rxjs/operators';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
	place$: Observable<any | Place>;
	placeId: string;
	form: FormGroup;
	isLoading = false;

	constructor(private route: ActivatedRoute, private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.place$ = this.route.paramMap.pipe(
			map(paramMap => {
				this.placeId = paramMap.get('placeId');
				return paramMap.get('placeId');
			}),
			switchMap(id => this.placesService.getSinglePlace(id)
				.pipe(
					tap(place => {
						this.form = new FormGroup({
							title: new FormControl(place.title, { updateOn: 'blur', validators: [Validators.required] }),
							description: new FormControl(place.description, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] }),
						});
						this.isLoading = false;
						return place;
					}),
					catchError(err => {
						return this.alertCtrl.create({
							header: 'An error occured!',
							message: 'Place could not be fetch.. Try again Later',
							buttons: [{text: 'Okay', handler: () => {
								this.router.navigate(['/places/tabs/offers']);
							}}]
						}).then(alertEl => {
							alertEl.present();
						})
					})
				))
		);
	}


	onUpdateOffer(): void {
		if (!this.form.valid) {
			return;
		}
		const {title, description} = this.form.value;

		this.loadingCtrl.create({ message: 'Updating place....' }).then(loadingEl => {
			loadingEl.present();
			this.place$.pipe(
				take(1),
				switchMap(place => this.placesService.updatePlace(place.id, {title, description}.title, {title, description}.description)),
				finalize(() => {
					loadingEl.dismiss();
					this.form.reset();
					this.router.navigate(['/places/tabs/offers']);
				}),
			).subscribe();
		});
	}

}
