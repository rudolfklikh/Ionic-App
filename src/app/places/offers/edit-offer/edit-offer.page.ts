import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap, finalize } from 'rxjs/operators';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
	place$: Observable<Place>;
	form: FormGroup;

	constructor(private route: ActivatedRoute, private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

	ngOnInit(): void {
		this.place$ = this.route.paramMap.pipe(
			map(paramMap => paramMap.get('placeId')),
			switchMap(id => this.placesService.getSinglePlace(id)
				.pipe(
					tap(place => {
						this.form = new FormGroup({
							title: new FormControl(place.title, { updateOn: 'blur', validators: [Validators.required] }),
							description: new FormControl(place.description, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] }),
						});
						return place;
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
