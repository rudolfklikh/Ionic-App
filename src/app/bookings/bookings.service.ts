import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingsService {
	private _bookings = new BehaviorSubject<Booking[]>([]);

	constructor(private authService: AuthService) { }
	get bookings() {
		return this._bookings.asObservable();
	}


	addBooking(
		placeId: string,
		placeTitle: string,
		placeImage: string,
		firstName: string,
		lastName: string,
		guestNumber: number,
		dateFrom: Date,
		dateTo: Date) {

		const newBooking = new Booking(
			Math.random().toString(),
			placeId,
			this.authService.userId,
			placeTitle,
			placeImage,
			firstName,
			lastName,
			guestNumber,
			dateFrom,
			dateTo
		);
		return this.bookings.pipe(
			take(1),
			delay(2000),
			tap((bookings: Array<Booking>) => {
				this._bookings.next(bookings.concat(newBooking));
			})
		);

	}
	cancelBooking(bookingId: string) {
		return this.bookings.pipe(
			take(1),
			delay(2000),
			tap((bookings: Array<Booking>) => {
				this._bookings.next(bookings.filter(b => b.id !== bookingId));
			})
		);
	}
}