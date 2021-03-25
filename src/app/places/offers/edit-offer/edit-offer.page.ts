import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place$: Observable<Place>;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private placesService: PlacesService) { }

  ngOnInit(): void {
    this.place$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('placeId')),
      switchMap(id => of(this.placesService.getSinglePlace(id))
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

    console.log(this.form, 'UPDATE');
  }

}
