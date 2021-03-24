import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place$: Observable<Place>;


  constructor(private router: Router, private navCtrl: NavController, private route: ActivatedRoute, private placesService: PlacesService) { }

  ngOnInit() {
    this.place$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('placeId')),
      switchMap(id => of(this.placesService.getSinglePlace(id)))
    );
  }


  onBookPlace() {
    this.navCtrl.navigateBack('/places/tabs/discover');
  }

}
