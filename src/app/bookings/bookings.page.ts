import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings$: Observable<Array<Booking>>;
  constructor(private bookingsService: BookingsService, private loadingCtr: LoadingController) { }

  ngOnInit() {
    this.loadedBookings$ = this.bookingsService.bookings;
  }

  onCancelBooking(bookingId, slidingEl: IonItemSliding) {
	  slidingEl.close();
	  this.loadingCtr.create({
		  message: 'Cancelling....'
	  }).then(loadingEl => {
		  loadingEl.present();
		  this.bookingsService.cancelBooking(bookingId).subscribe(() => loadingEl.dismiss());
	  })
  }

}
