import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PagedResult,
  PropertyCreatePayload,
  PropertyItem,
  PropertySearchParams
} from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly url = 'http://localhost:5255/api/property';
  private readonly reviewUrl = 'http://localhost:5255/api/review';

  constructor(private readonly http: HttpClient) {}

  getAll(search: PropertySearchParams = {}) {
    let params = new HttpParams();
    const booleanKeys = ['hasPool', 'isBeachFacing', 'hasGarden'];
    Object.entries(search).forEach(([key, value]) => {
      // For booleans: only send if explicitly true — false/undefined means "no filter"
      if (booleanKeys.includes(key)) {
        if (value === true) {
          params = params.set(key, 'true');
        }
      } else if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PagedResult<PropertyItem>>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<PropertyItem>(`${this.url}/${id}`);
  }

  add(data: PropertyCreatePayload) {
    return this.http.post<PropertyItem>(this.url, data);
  }

  update(id: number, data: PropertyCreatePayload) {
    return this.http.put<PropertyItem>(`${this.url}/${id}`, data);
  }

  myProperties() {
    return this.http.get<PropertyItem[]>(`${this.url}/my`);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getReviews(propertyId: number) {
    return this.http.get<any[]>(`${this.reviewUrl}/property/${propertyId}`);
  }

  addReview(payload: any) {
    return this.http.post<any>(this.reviewUrl, payload);
  }

  getOwnerAnalytics() {
    return this.http.get<any>('http://localhost:5255/api/analytics/owner/dashboard');
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.url}/upload-image`, formData);
  }
}
