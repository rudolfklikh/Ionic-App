import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { filter, take, map, tap, timeout, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


export interface PlaceData {
	availableFrom: string;
	availableTo: string;
	description: string;
	imgUrl: string;
	price: number;
	title: string;
	userId: string;
}

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	private _places = new BehaviorSubject<Place[]>([]);

	constructor(private authService: AuthService, private http: HttpClient) { }

	fetchPlaces() {
		return this.http.get<{ [key: string]: PlaceData }>('https://first-ionic-app-cffc9-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
			.pipe(
				map(resData => {
					const places = [];

					for (const key in resData) {
						if (Object.prototype.hasOwnProperty.call(resData, key)) {
							places.push(new Place(
								key,
								resData[key].title,
								resData[key].description,
								resData[key].imgUrl,
								resData[key].price,
								new Date(resData[key].availableFrom),
								new Date(resData[key].availableTo),
								resData[key].userId))
						}
					}
					return places;
				}),
				delay(1500),
				tap(places => {
					this._places.next(places);
				})
			)
	}


	get places() {
		return this._places.asObservable();
	};


	getSinglePlace<PlaceData>(id: string) {
		return this.http.get(`https://first-ionic-app-cffc9-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${id}.json`).pipe(
			map((placeData: any) => {
				return new Place(id, 	
					placeData.title,
					placeData.description,
					placeData.imgUrl,
					placeData.price,
					new Date(placeData.availableFrom),
					new Date(placeData.availableTo),
					placeData.userId)
			})
		)
	}


	addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
		let generatedId: string;
		const newPlace = new Place(
			Math.random().toString(),
			title,
			description,
			'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
			price,
			dateFrom,
			dateTo,
			this.authService.userId
		);

		return this.http.post<{ name: string }>('https://first-ionic-app-cffc9-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json', { ...newPlace, id: null })
			.pipe(
				switchMap(resData => {
					generatedId = resData.name;
					return this.places;
				}),
				take(1),
				tap((places: Array<Place>) => {
					newPlace.id = generatedId;
					this._places.next(places.concat(newPlace));
				})
			);
	}



	updatePlace(placeId: string, title: string, description: string) {
		let updatedPlaces: Place[];
		return this.places.pipe(
			take(1),
			delay(1000),
			switchMap((places: Array<Place>) => {
				if (!places || places.length <= 0) {
					return this.fetchPlaces();
				} else {
					return of(places);
				}
			}),
			switchMap((places: Array<Place>) => {
				const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
				updatedPlaces = [...places];
				const oldPlace = updatedPlaces[updatedPlaceIndex];
				updatedPlaces[updatedPlaceIndex] = new Place(
					oldPlace.id,
					title,
					description,
					oldPlace.imgUrl,
					oldPlace.price,
					oldPlace.availableFrom,
					oldPlace.availableTo,
					oldPlace.userId);

				return this.http.put(
					`https://first-ionic-app-cffc9-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`,
					{...updatedPlaces[updatedPlaceIndex], id: null }
				);
			}),
			tap(() => {
				this._places.next(updatedPlaces);
			})
		)
	}
}
