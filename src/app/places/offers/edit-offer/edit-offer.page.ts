import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place$: Observable<Place>;

  constructor(private route: ActivatedRoute, private placesService: PlacesService) { }

  ngOnInit() {
    this.place$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('placeId')),
      switchMap(id => of(this.placesService.getSinglePlace(id)))
    );
  }

}
