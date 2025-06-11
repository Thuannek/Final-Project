export enum ToiletType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum GenderType {
  UNISEX = "UNISEX",
  GENDER_SEPARATED = "GENDER_SEPARATED",
}

export enum Feature {
  ACCESSIBLE = "ACCESSIBLE",
  WATER_LASER = "WATER_LASER",
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
}

export interface Toilet {
  id: number;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: ToiletType;
  gender: GenderType;
  features: Feature[];
  hasFee: boolean;
  waterLaser: boolean;
  rating: number;
  reviewCount: number;
  distance: number;
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  reviews: Review[];
}
