import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyCreatePayload, PropertyItem } from '../../core/models/property.model';
import { PropertyService } from '../../core/services/property.service';
import { PropertyCard } from '../../shared/components/property-card/property-card';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyCard],
  templateUrl: './owner-dashboard.html'
})
export class OwnerDashboard implements OnInit {
  properties: PropertyItem[] = [];
  loading = true;
  error = '';
  success = '';
  editModalOpen = false;
  editingProperty: PropertyItem | null = null;

  analytics: any = null;
  analyticsLoading = true;
  analyticsError = '';

  editModel: PropertyCreatePayload = {
    title: '',
    location: '',
    propertyType: 'Apartment',
    price: 0,
    maxGuests: 2,
    description: '',
    imageUrl: '',
    hasPool: false,
    isBeachFacing: false,
    hasGarden: false
  };

  constructor(
    private readonly service: PropertyService,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit() {
    this.fetch();
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    this.analyticsLoading = true;
    this.service.getOwnerAnalytics().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.analytics = res;
          this.analyticsLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.analyticsError = 'Failed to load analytics.';
          this.analyticsLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  fetch() {
    this.loading = true;
    this.error = '';
    this.service.myProperties().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.properties = res ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('[OwnerDashboard] Error:', err);
          this.error = 'Unable to load your properties.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  openEdit(property: PropertyItem) {
    this.editingProperty = property;
    this.editModel = {
      title: property.title,
      location: property.location,
      propertyType: property.propertyType,
      price: property.price,
      maxGuests: property.maxGuests,
      description: property.description,
      imageUrl: property.imageUrl,
      hasPool: property.hasPool,
      isBeachFacing: property.isBeachFacing,
      hasGarden: property.hasGarden
    };
    this.editModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEdit() {
    this.editModalOpen = false;
    this.editingProperty = null;
    this.cdr.detectChanges();
  }

  saveEdit() {
    if (!this.editingProperty) return;
    this.service.update(this.editingProperty.id, this.editModel).subscribe({
      next: (updated) => {
        this.ngZone.run(() => {
          this.properties = this.properties.map((x) => (x.id === updated.id ? updated : x));
          this.success = 'Property updated.';
          this.closeEdit();
          this.cdr.detectChanges();
        });
      }
    });
  }

  deleteProperty(property: PropertyItem) {
    this.service.delete(property.id).subscribe(() => {
      this.ngZone.run(() => {
        this.properties = this.properties.filter((p) => p.id !== property.id);
        this.success = 'Property deleted.';
        this.cdr.detectChanges();
      });
    });
  }
}
