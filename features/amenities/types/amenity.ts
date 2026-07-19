export interface Amenity {
  id: string;
  key: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmenityPayload {
  key: string;
  title: string;
  category: string;
}
