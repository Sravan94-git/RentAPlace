import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingCreatePayload } from '../../core/models/booking.model';
import { PropertyItem } from '../../core/models/property.model';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { PropertyService } from '../../core/services/property.service';
import { MessageService } from '../../core/services/message.service';
import { Review, ReviewCreatePayload } from '../../core/models/review.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './property-detail.html'
})
export class PropertyDetail implements OnInit {
  property: PropertyItem | null = null;
  loading = true;
  error = '';

  reviews: Review[] = [];
  reviewForm: ReviewCreatePayload = { propertyId: 0, rating: 5, comment: '' };
  reviewLoading = false;
  reviewError = '';
  reviewSuccess = '';

  today = new Date().toISOString().split('T')[0];
  tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  form: BookingCreatePayload = {
    propertyId: 0,
    checkInDate: '',
    checkOutDate: '',
    guests: 1
  };

  bookingLoading = false;
  bookingError = '';
  bookingSuccess = '';

  messageContent = '';
  messageLoading = false;
  messageError = '';
  messageSuccess = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly propertyService: PropertyService,
    private readonly bookingService: BookingService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/properties']); return; }
    this.propertyService.getById(id).subscribe({
      next: (p) => {
        this.ngZone.run(() => {
          this.property = p;
          this.form.propertyId = p.id;
          this.reviewForm.propertyId = p.id;
          this.loading = false;
          this.fetchReviews(p.id);
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.error = 'Property not found.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  get isLoggedIn() { return this.authService.isLoggedIn(); }
  get isRenter() { return this.authService.isRenter(); }
  get isOwner() { return this.authService.isOwner(); }

  get nights(): number {
    if (!this.form.checkInDate || !this.form.checkOutDate) return 0;
    const diff = new Date(this.form.checkOutDate).getTime() - new Date(this.form.checkInDate).getTime();
    return Math.max(0, Math.floor(diff / 86400000));
  }

  get totalPrice(): number {
    return this.nights * (this.property?.price ?? 0);
  }

  get amenities(): { icon: string; label: string; available: boolean }[] {
    return [
      { icon: '🏊', label: 'Private Pool', available: this.property?.hasPool ?? false },
      { icon: '🏖️', label: 'Beach Facing', available: this.property?.isBeachFacing ?? false },
      { icon: '🌿', label: 'Private Garden', available: this.property?.hasGarden ?? false },
      { icon: '📶', label: 'Free Wi-Fi', available: true },
      { icon: '❄️', label: 'Air Conditioning', available: true },
      { icon: '🚗', label: 'Free Parking', available: true },
      { icon: '🍳', label: 'Full Kitchen', available: true },
      { icon: '🔒', label: '24/7 Security', available: true },
    ];
  }

  book() {
    if (!this.isLoggedIn) { this.router.navigate(['/login']); return; }
    if (!this.form.checkInDate || !this.form.checkOutDate) {
      this.bookingError = 'Please select your check-in and check-out dates.'; return;
    }
    if (this.nights < 1) {
      this.bookingError = 'Check-out must be after check-in.'; return;
    }
    if (this.form.guests < 1 || this.form.guests > (this.property?.maxGuests ?? 1)) {
      this.bookingError = `Guests must be between 1 and ${this.property?.maxGuests}.`; return;
    }

    this.bookingLoading = true;
    this.bookingError = '';
    this.bookingSuccess = '';

    this.bookingService.create({ ...this.form }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.bookingLoading = false;
          this.bookingSuccess = '🎉 Booking confirmed! Check My Bookings for details.';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.bookingLoading = false;
          this.bookingError = err?.error?.message || 'Booking failed. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  sendMessageToOwner() {
    if (!this.property) return;
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.messageContent.trim()) {
      this.messageError = 'Message cannot be empty.';
      return;
    }

    this.messageLoading = true;
    this.messageError = '';
    this.messageSuccess = '';

    const payload = {
      propertyId: this.property.id,
      receiverId: this.property.ownerId,
      content: this.messageContent.trim()
    };

    this.messageService.send(payload).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.messageLoading = false;
          this.messageSuccess = 'Message sent successfully!';
          this.messageContent = '';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.messageLoading = false;
          this.messageError = err?.error?.message || 'Failed to send message.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  fetchReviews(id: number) {
    this.propertyService.getReviews(id).subscribe({
      next: (revs: Review[]) => {
        this.ngZone.run(() => {
          this.reviews = revs;
          this.cdr.detectChanges();
        });
      }
    });
  }

  submitReview() {
    if (!this.property) return;
    if (!this.reviewForm.comment.trim()) {
      this.reviewError = 'Comment cannot be empty.';
      return;
    }

    this.reviewLoading = true;
    this.reviewError = '';
    this.reviewSuccess = '';

    const payload = { ...this.reviewForm, comment: this.reviewForm.comment.trim() };

    this.propertyService.addReview(payload).subscribe({
      next: (newReview: Review) => {
        this.ngZone.run(() => {
          this.reviewLoading = false;
          this.reviewSuccess = 'Review submitted successfully!';
          this.reviews.unshift(newReview);
          this.property!.reviewsCount = (this.property!.reviewsCount || 0) + 1;
          
          const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
          this.property!.rating = Number((totalRating / this.property!.reviewsCount).toFixed(1));

          this.reviewForm.rating = 5;
          this.reviewForm.comment = '';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.reviewLoading = false;
          this.reviewError = err?.error?.message || 'Failed to submit review.';
          this.cdr.detectChanges();
        });
      }
    });
  }
}
