export interface Review {
  id: number;
  propertyId: number;
  reviewerId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewCreatePayload {
  propertyId: number;
  rating: number;
  comment: string;
}
