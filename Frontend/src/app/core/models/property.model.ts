export interface PropertyItem {
  id: number;
  title: string;
  location: string;
  propertyType: string;
  price: number;
  description: string;
  imageUrl: string;
  hasPool: boolean;
  isBeachFacing: boolean;
  hasGarden: boolean;
  maxGuests: number;
  rating: number;
  reviewsCount?: number;
  ownerId: number;
}

export interface PropertySearchParams {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  hasPool?: boolean;
  isBeachFacing?: boolean;
  hasGarden?: boolean;
  guests?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PropertyCreatePayload {
  title: string;
  location: string;
  propertyType: string;
  price: number;
  maxGuests: number;
  description: string;
  imageUrl: string;
  hasPool: boolean;
  isBeachFacing: boolean;
  hasGarden: boolean;
}
